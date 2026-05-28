import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export interface SongStreamStat {
  songId: string;
  streams: number;
  downloads: number;
}

export async function getSongStreamStat(songId: string): Promise<SongStreamStat> {
  const db = getFirestore();
  const snap = await getDoc(doc(db, "tracks", songId));

  if (!snap.exists()) {
    return { songId, streams: 0, downloads: 0 };
  }

  const data = snap.data();
  return {
    songId,
    streams:   data.streams   ?? 0,
    downloads: data.downloads ?? 0,
  };
}


export async function getSongStreamStats(
  songIds: string[]
): Promise<Map<string, SongStreamStat>> {
  const results = await Promise.all(songIds.map((id) => getSongStreamStat(id)));
  return new Map(results.map((stat) => [stat.songId, stat]));
}


export async function getTopStreamedSongs(
  topN: number = 5
): Promise<SongStreamStat[]> {
  const db = getFirestore();
  const snap = await getDocs(
    query(collection(db, "tracks"), orderBy("streams", "desc"), limit(topN))
  );

  return snap.docs.map((d) => ({
    songId:    d.id,
    streams:   d.data().streams   ?? 0,
    downloads: d.data().downloads ?? 0,
  }));
}