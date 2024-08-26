const CACHE_DEFAULT_TIME_TO_LIVE_IN_MILLISECONDS = 12 * 60 * 60 * 1000;

export default function cacheUserId(ttl: number = CACHE_DEFAULT_TIME_TO_LIVE_IN_MILLISECONDS) {
  const cache = new Map<number, number>();
  return ({
    add(id: number) {
      // console.log('cache added');
      const expiry = Date.now() + ttl;
      cache.set(id, expiry);
      this.cleanup();
    },
    isNotCached(id: number) {
      const expiry = cache.get(id);
      // console.log('cache_LOG', cache);
      // console.log('is not cached:', !(!!expiry) || expiry! < Date.now());
      return !(!!expiry) || expiry! < Date.now();
    },
    remove(id: number) {
      // console.log('cache removed');
      cache.delete(id);
    },
    cleanup() {
      // console.log('cache cleaned up');
      for (const entry of cache) {
        if (entry[1] < Date.now()) {
          cache.delete(entry[0]);
        }
      }
    },
    sweepout() {
      cache.clear();
    },
  });
}