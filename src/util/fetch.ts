type FetchOptions = {
  timeout?: number;
  abortIfCached?: boolean;
} & FetchRequestInit;

const DEFAULT_TIMEOUT = 5_000;

const cache = new Set<string>();

export default function fetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response | null> {
  return new Promise((resolve) => {
    if (options.abortIfCached && cache.has(url)) {
      resolve(null);
      return;
    }

    cache.add(url);
    const controller = new AbortController();
    const timeout = options.timeout ?? DEFAULT_TIMEOUT;

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    global
      .fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}
