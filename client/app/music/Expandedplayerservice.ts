import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  increment,
  serverTimestamp,
  orderBy,
  onSnapshot,
  Unsubscribe,
  Timestamp,
  query,
  writeBatch,
} from "firebase/firestore";

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike";
  timestamp: number;
}

export interface Comment {
  id: string;
  trackId: string;
  author: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike";
  timestamp: number;
  replies: CommentReply[];
}

export interface TrackStats {
  streams: number;
  likes: number;
  commentCount: number;
  downloads: number;
}

function db() {
  return getFirestore();
}

function trackRef(trackId: string) {
  return doc(db(), "tracks", trackId);
}

function commentsCol(trackId: string) {
  return collection(db(), "tracks", trackId, "comments");
}

function repliesCol(trackId: string, commentId: string) {
  return collection(db(), "tracks", trackId, "comments", commentId, "replies");
}

/**
 * Ensures the track document exists. Uses setDoc with merge:true so concurrent
 * calls are safe — no more "document does not exist" errors from updateDoc.
 */
async function ensureTrackDoc(trackId: string): Promise<void> {
  const ref = trackRef(trackId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // merge:true is safe even if another caller created the doc between our
    // getDoc and this setDoc — it will just be a no-op on existing fields.
    await setDoc(ref, { streams: 0, likes: 0, commentCount: 0, downloads: 0 }, { merge: true });
  }
}

export async function recordStream(trackId: string): Promise<void> {
  try {
    await ensureTrackDoc(trackId);
    await updateDoc(trackRef(trackId), { streams: increment(1) });
  } catch (e) {
    console.error("[recordStream] Failed to record stream for", trackId, e);
    throw e;
  }
}

export async function toggleLikeInDb(
  trackId: string,
  currentlyLiked: boolean
): Promise<boolean> {
  try {
    await ensureTrackDoc(trackId);
    const delta = currentlyLiked ? -1 : 1;
    await updateDoc(trackRef(trackId), { likes: increment(delta) });
    return !currentlyLiked;
  } catch (e) {
    console.error("[toggleLikeInDb] Failed for", trackId, e);
    throw e;
  }
}

export function subscribeToTrackStats(
  trackId: string,
  onChange: (stats: TrackStats) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const ref = trackRef(trackId);
  ensureTrackDoc(trackId).catch((e) => {
    console.error("[subscribeToTrackStats] ensureTrackDoc failed", e);
    onError?.(e);
  });
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange({ streams: 0, likes: 0, commentCount: 0, downloads: 0 });
        return;
      }
      const data = snap.data();
      onChange({
        streams: data.streams ?? 0,
        likes: data.likes ?? 0,
        commentCount: data.commentCount ?? 0,
        downloads: data.downloads ?? 0,
      });
    },
    (e) => {
      console.error("[subscribeToTrackStats] onSnapshot error", e);
      onError?.(e);
    }
  );
}

export function subscribeToComments(
  trackId: string,
  onChange: (comments: Comment[]) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const repliesMap = new Map<string, CommentReply[]>();
  const replyUnsubs = new Map<string, Unsubscribe>();
  let commentDocs: Array<{ id: string; data: Record<string, any> }> = [];

  function rebuild() {
    const comments: Comment[] = commentDocs.map((cd) => ({
      id: cd.id,
      trackId,
      author: cd.data.author ?? "Anonymous",
      text: cd.data.text ?? "",
      likes: cd.data.likes ?? 0,
      dislikes: cd.data.dislikes ?? 0,
      userVote: undefined,
      timestamp:
        cd.data.timestamp instanceof Timestamp
          ? cd.data.timestamp.toMillis()
          : typeof cd.data.timestamp === "number"
          ? cd.data.timestamp
          : Date.now(),
      replies: repliesMap.get(cd.id) ?? [],
    }));
    onChange(comments);
  }

  const q = query(commentsCol(trackId), orderBy("timestamp", "asc"));

  const unsubComments = onSnapshot(
    q,
    (snap) => {
      commentDocs = snap.docs.map((d) => ({ id: d.id, data: d.data() }));

      // Start a reply listener for every new comment doc
      snap.docs.forEach((d) => {
        if (!replyUnsubs.has(d.id)) {
          const rq = query(repliesCol(trackId, d.id), orderBy("timestamp", "asc"));
          const unsubReply = onSnapshot(
            rq,
            (rSnap) => {
              repliesMap.set(
                d.id,
                rSnap.docs.map((r) => {
                  const rd = r.data();
                  return {
                    id: r.id,
                    author: rd.author ?? "Anonymous",
                    text: rd.text ?? "",
                    likes: rd.likes ?? 0,
                    dislikes: rd.dislikes ?? 0,
                    userVote: undefined,
                    timestamp:
                      rd.timestamp instanceof Timestamp
                        ? rd.timestamp.toMillis()
                        : typeof rd.timestamp === "number"
                        ? rd.timestamp
                        : Date.now(),
                  };
                })
              );
              rebuild();
            },
            (e) => {
              console.error("[subscribeToComments] reply onSnapshot error for comment", d.id, e);
              onError?.(e);
            }
          );
          replyUnsubs.set(d.id, unsubReply);
        }
      });

      // Clean up listeners for deleted comments
      const currentIds = new Set(snap.docs.map((d) => d.id));
      replyUnsubs.forEach((unsub, id) => {
        if (!currentIds.has(id)) {
          unsub();
          replyUnsubs.delete(id);
          repliesMap.delete(id);
        }
      });

      rebuild();
    },
    (e) => {
      console.error("[subscribeToComments] comments onSnapshot error", e);
      onError?.(e);
    }
  );

  return () => {
    unsubComments();
    replyUnsubs.forEach((unsub) => unsub());
    replyUnsubs.clear();
    repliesMap.clear();
  };
}

/**
 * Writes the comment and increments commentCount atomically using a batch,
 * so the count can never be out of sync and partial writes can't happen.
 */
export async function addCommentToDb(
  trackId: string,
  author: string,
  text: string
): Promise<string> {
  const trimmedText = text.trim();
  const trimmedAuthor = author.trim() || "Anonymous";

  if (!trimmedText) {
    throw new Error("Comment text cannot be empty.");
  }
  if (!trackId) {
    throw new Error("trackId is required to post a comment.");
  }

  try {
    // Ensure parent track doc exists before batch (batch updateDoc requires it)
    await ensureTrackDoc(trackId);

    // Use a batch so the comment write + count increment are atomic
    const batch = writeBatch(db());
    const commentRef = doc(commentsCol(trackId)); // auto-id
    batch.set(commentRef, {
      author: trimmedAuthor,
      text: trimmedText,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp(),
    });
    batch.update(trackRef(trackId), { commentCount: increment(1) });
    await batch.commit();

    console.log("[addCommentToDb] Comment written:", commentRef.id, "track:", trackId);
    return commentRef.id;
  } catch (e: any) {
    console.error("[addCommentToDb] Failed to write comment. trackId:", trackId, "Error:", e?.code, e?.message, e);
    throw new Error(
      e?.code === "permission-denied"
        ? "Permission denied — check your Firestore security rules."
        : e?.message ?? "Failed to post comment. Please try again."
    );
  }
}

export async function voteCommentInDb(
  trackId: string,
  commentId: string,
  previousVote: "like" | "dislike" | undefined,
  newVote: "like" | "dislike"
): Promise<"like" | "dislike" | undefined> {
  try {
    const ref = doc(commentsCol(trackId), commentId);
    if (previousVote === newVote) {
      await updateDoc(ref, {
        [newVote === "like" ? "likes" : "dislikes"]: increment(-1),
      });
      return undefined;
    }
    const updates: Record<string, ReturnType<typeof increment>> = {
      [newVote === "like" ? "likes" : "dislikes"]: increment(1),
    };
    if (previousVote) {
      updates[previousVote === "like" ? "likes" : "dislikes"] = increment(-1);
    }
    await updateDoc(ref, updates);
    return newVote;
  } catch (e: any) {
    console.error("[voteCommentInDb] Failed", e?.code, e?.message);
    throw new Error(e?.message ?? "Failed to register vote.");
  }
}

export async function addReplyToDb(
  trackId: string,
  commentId: string,
  author: string,
  text: string
): Promise<string> {
  const trimmedText = text.trim();
  const trimmedAuthor = author.trim() || "Anonymous";

  if (!trimmedText) throw new Error("Reply text cannot be empty.");
  if (!trackId || !commentId) throw new Error("trackId and commentId are required.");

  try {
    const ref = await addDoc(repliesCol(trackId, commentId), {
      author: trimmedAuthor,
      text: trimmedText,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp(),
    });
    console.log("[addReplyToDb] Reply written:", ref.id, "comment:", commentId);
    return ref.id;
  } catch (e: any) {
    console.error("[addReplyToDb] Failed. trackId:", trackId, "commentId:", commentId, "Error:", e?.code, e?.message, e);
    throw new Error(
      e?.code === "permission-denied"
        ? "Permission denied — check your Firestore security rules."
        : e?.message ?? "Failed to post reply. Please try again."
    );
  }
}

export async function voteReplyInDb(
  trackId: string,
  commentId: string,
  replyId: string,
  previousVote: "like" | "dislike" | undefined,
  newVote: "like" | "dislike"
): Promise<"like" | "dislike" | undefined> {
  try {
    const ref = doc(repliesCol(trackId, commentId), replyId);
    if (previousVote === newVote) {
      await updateDoc(ref, {
        [newVote === "like" ? "likes" : "dislikes"]: increment(-1),
      });
      return undefined;
    }
    const updates: Record<string, ReturnType<typeof increment>> = {
      [newVote === "like" ? "likes" : "dislikes"]: increment(1),
    };
    if (previousVote) {
      updates[previousVote === "like" ? "likes" : "dislikes"] = increment(-1);
    }
    await updateDoc(ref, updates);
    return newVote;
  } catch (e: any) {
    console.error("[voteReplyInDb] Failed", e?.code, e?.message);
    throw new Error(e?.message ?? "Failed to register vote.");
  }
}

export async function downloadTrack(
  audioUrl: string,
  filename: string,
  trackId?: string
): Promise<void> {
  triggerDownload(audioUrl, filename);
  if (trackId) {
    try {
      await ensureTrackDoc(trackId);
      await updateDoc(trackRef(trackId), { downloads: increment(1) });
    } catch (e) {
      console.warn("[downloadTrack] Could not record download:", e);
    }
  }
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = sanitiseFilename(filename);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function sanitiseFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "-").trim() || "track";
}
