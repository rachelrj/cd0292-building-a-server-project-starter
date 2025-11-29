import { LRUCache } from "lru-cache";

export const imageCache = new LRUCache<string, Buffer>({
  max: 500,
  ttl: 1000 * 60 * 60,
});
