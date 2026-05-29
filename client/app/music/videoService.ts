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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoCommentReply {
  id: string;
  author: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike";
  timestamp: number;
}

export interface VideoComment {
  id: string;
  videoId: string;
  author: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike";
  timestamp: number;
  replies: VideoCommentReply[];
}

export interface VideoStats {
  views: number;
  likes: number;
  commentCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function db() {
  return getFirestore();
}

function videoRef(videoId: string) {
  return doc(db(), "videoStats", videoId);
}

function commentsCol(videoId: string) {
  return collection(db(), "videoStats", videoId, "comments");
}

function repliesCol(videoId: string, commentId: string) {
  return collection(db(), "videoStats", videoId, "comments", commentId, "replies");
}

/**
 * Ensures the video stat document exists before any increment/update.
 * Uses merge:true so concurrent calls are safe.
 */
async function ensureVideoDoc(videoId: string): Promise<void> {
  const ref = videoRef(videoId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { views: 0, likes: 0, commentCount: 0 }, { merge: true });
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function recordVideoView(videoId: string): Promise<void> {
  try {
    await ensureVideoDoc(videoId);
    await updateDoc(videoRef(videoId), { views: increment(1) });
  } catch (e) {
    console.error("[recordVideoView] Failed for", videoId, e);
    throw e;
  }
}

export async function toggleVideoLikeInDb(
  videoId: string,
  currentlyLiked: boolean
): Promise<boolean> {
  try {
    await ensureVideoDoc(videoId);
    const delta = currentlyLiked ? -1 : 1;
    await updateDoc(videoRef(videoId), { likes: increment(delta) });
    return !currentlyLiked;
  } catch (e) {
    console.error("[toggleVideoLikeInDb] Failed for", videoId, e);
    throw e;
  }
}

export function subscribeToVideoStats(
  videoId: string,
  onChange: (stats: VideoStats) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const ref = videoRef(videoId);
  ensureVideoDoc(videoId).catch((e) => {
    console.error("[subscribeToVideoStats] ensureVideoDoc failed", e);
    onError?.(e);
  });
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange({ views: 0, likes: 0, commentCount: 0 });
        return;
      }
      const data = snap.data();
      onChange({
        views: data.views ?? 0,
        likes: data.likes ?? 0,
        commentCount: data.commentCount ?? 0,
      });
    },
    (e) => {
      console.error("[subscribeToVideoStats] onSnapshot error", e);
      onError?.(e);
    }
  );
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export function subscribeToVideoComments(
  videoId: string,
  onChange: (comments: VideoComment[]) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const repliesMap = new Map<string, VideoCommentReply[]>();
  const replyUnsubs = new Map<string, Unsubscribe>();
  let commentDocs: Array<{ id: string; data: Record<string, any> }> = [];

  function rebuild() {
    const comments: VideoComment[] = commentDocs.map((cd) => ({
      id: cd.id,
      videoId,
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

  const q = query(commentsCol(videoId), orderBy("timestamp", "asc"));

  const unsubComments = onSnapshot(
    q,
    (snap) => {
      commentDocs = snap.docs.map((d) => ({ id: d.id, data: d.data() }));

      snap.docs.forEach((d) => {
        if (!replyUnsubs.has(d.id)) {
          const rq = query(repliesCol(videoId, d.id), orderBy("timestamp", "asc"));
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
              console.error("[subscribeToVideoComments] reply error for comment", d.id, e);
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
      console.error("[subscribeToVideoComments] comments onSnapshot error", e);
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

export async function addVideoCommentToDb(
  videoId: string,
  author: string,
  text: string
): Promise<string> {
  const trimmedText = text.trim();
  const trimmedAuthor = author.trim() || "Anonymous";

  if (!trimmedText) throw new Error("Comment text cannot be empty.");
  if (!videoId) throw new Error("videoId is required to post a comment.");

  try {
    await ensureVideoDoc(videoId);

    const batch = writeBatch(db());
    const commentRef = doc(commentsCol(videoId));
    batch.set(commentRef, {
      author: trimmedAuthor,
      text: trimmedText,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp(),
    });
    batch.update(videoRef(videoId), { commentCount: increment(1) });
    await batch.commit();

    console.log("[addVideoCommentToDb] Comment written:", commentRef.id, "video:", videoId);
    return commentRef.id;
  } catch (e: any) {
    console.error("[addVideoCommentToDb] Failed. videoId:", videoId, "Error:", e?.code, e?.message);
    throw new Error(
      e?.code === "permission-denied"
        ? "Permission denied — check your Firestore security rules."
        : e?.message ?? "Failed to post comment. Please try again."
    );
  }
}

export async function voteVideoCommentInDb(
  videoId: string,
  commentId: string,
  previousVote: "like" | "dislike" | undefined,
  newVote: "like" | "dislike"
): Promise<"like" | "dislike" | undefined> {
  try {
    const ref = doc(commentsCol(videoId), commentId);
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
    console.error("[voteVideoCommentInDb] Failed", e?.code, e?.message);
    throw new Error(e?.message ?? "Failed to register vote.");
  }
}

export async function addVideoReplyToDb(
  videoId: string,
  commentId: string,
  author: string,
  text: string
): Promise<string> {
  const trimmedText = text.trim();
  const trimmedAuthor = author.trim() || "Anonymous";

  if (!trimmedText) throw new Error("Reply text cannot be empty.");
  if (!videoId || !commentId) throw new Error("videoId and commentId are required.");

  try {
    const ref = await addDoc(repliesCol(videoId, commentId), {
      author: trimmedAuthor,
      text: trimmedText,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp(),
    });
    console.log("[addVideoReplyToDb] Reply written:", ref.id, "comment:", commentId);
    return ref.id;
  } catch (e: any) {
    console.error("[addVideoReplyToDb] Failed. videoId:", videoId, "commentId:", commentId, "Error:", e?.code, e?.message);
    throw new Error(
      e?.code === "permission-denied"
        ? "Permission denied — check your Firestore security rules."
        : e?.message ?? "Failed to post reply. Please try again."
    );
  }
}

export async function voteVideoReplyInDb(
  videoId: string,
  commentId: string,
  replyId: string,
  previousVote: "like" | "dislike" | undefined,
  newVote: "like" | "dislike"
): Promise<"like" | "dislike" | undefined> {
  try {
    const ref = doc(repliesCol(videoId, commentId), replyId);
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
    console.error("[voteVideoReplyInDb] Failed", e?.code, e?.message);
    throw new Error(e?.message ?? "Failed to register vote.");
  }
}
