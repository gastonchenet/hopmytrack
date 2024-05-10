import startOptions from "../options";

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
      resolve(new Response(null, { status: 408 }));
      return;
    }

    cache.add(url);
    const controller = new AbortController();
    const timeout = options.timeout ?? DEFAULT_TIMEOUT;
    options.signal = options.signal ?? controller.signal;
    if (startOptions.proxy) startOptions.proxy = options.proxy;

    const timer = setTimeout(() => controller.abort(), timeout);

    global
      .fetch(url, options)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((error) => {
        if (error === "AbortError") {
          resolve(new Response(null, { status: 408 }));
          return;
        }

        clearTimeout(timer);
        resolve(null);
      });
  });
}
