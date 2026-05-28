import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

export interface PlatformTotals {
  totalStreams: number;
  totalDownloads: number;
}

export async function getPlatformTotals(): Promise<PlatformTotals> {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, "tracks"));

  let totalStreams = 0;
  let totalDownloads = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    totalStreams   += data.streams   ?? 0;
    totalDownloads += data.downloads ?? 0;
  });

  return { totalStreams, totalDownloads };
}