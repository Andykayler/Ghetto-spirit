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

/**
 * Returns stream + download counts for a single song by reading
 * tracks/{songId} — the document recordStream() and downloadTrack() write to.
 */
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

/**
 * Fetches stream + download counts for a list of song IDs in parallel.
 * Returns a map of songId → SongStreamStat for O(1) lookup in the UI.
 *
 * Usage:
 *   const statsMap = await getSongStreamStats(["id1", "id2", "id3"]);
 *   const streams  = statsMap.get("id1")?.streams ?? 0;
 */
export async function getSongStreamStats(
  songIds: string[]
): Promise<Map<string, SongStreamStat>> {
  const results = await Promise.all(songIds.map((id) => getSongStreamStat(id)));
  return new Map(results.map((stat) => [stat.songId, stat]));
}

/**
 * Returns the top N songs by stream count, reading directly from the
 * `tracks` collection (which owns the authoritative stream data).
 *
 * Each entry includes the songId so callers can cross-reference with
 * metadata from the `songs` collection if needed.
 */
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

export interface ArtistStreamStat {
  name: string;
  streams: number;
  songs: number;
}

/**
 * Aggregates total stream counts per artist by:
 *   1. Reading every song doc from `songs` to get artist name + song ID
 *   2. Batch-fetching real stream counts from `tracks/{songId}`
 *   3. Summing streams per artist name
 *
 * Returns a sorted array (highest streams first), optionally capped at topN.
 *
 * Usage:
 *   const artists = await getArtistStreamStats(6);
 */
export async function getArtistStreamStats(
  topN?: number
): Promise<ArtistStreamStat[]> {
  const db = getFirestore();

  // Step 1: load all song docs for artist name + id
  const songsSnap = await getDocs(collection(db, "songs"));
  if (songsSnap.empty) return [];

  const songIds = songsSnap.docs.map((d) => d.id);

  // Step 2: batch-fetch real stream counts from tracks
  const statsMap = await getSongStreamStats(songIds);

  // Step 3: accumulate per artist
  const artistMap = new Map<string, ArtistStreamStat>();
  songsSnap.forEach((d) => {
    const data   = d.data();
    const artist = data.artist as string | undefined;
    if (!artist) return;

    const streams = statsMap.get(d.id)?.streams ?? 0;

    if (!artistMap.has(artist)) {
      artistMap.set(artist, { name: artist, streams: 0, songs: 0 });
    }
    const entry = artistMap.get(artist)!;
    entry.streams += streams;
    entry.songs   += 1;
  });

  const sorted = Array.from(artistMap.values()).sort((a, b) => b.streams - a.streams);
  return topN ? sorted.slice(0, topN) : sorted;
}