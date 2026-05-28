
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Moves a song from "songs" collection into "archive".
 */
export async function archiveSong(songId: string) {
  const ref = doc(db, "songs", songId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Song not found");

  await addDoc(collection(db, "archive"), {
    type: "song",
    originalData: snap.data(),
    ...snap.data(),
    deletedAt: serverTimestamp(),
  });

  await deleteDoc(ref);
}

/**
 * Moves an artist from "artists" collection into "archive".
 */
export async function archiveArtist(artistId: string) {
  const ref = doc(db, "artists", artistId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Artist not found");

  await addDoc(collection(db, "archive"), {
    type: "artist",
    originalData: snap.data(),
    ...snap.data(),
    deletedAt: serverTimestamp(),
  });

  await deleteDoc(ref);
}