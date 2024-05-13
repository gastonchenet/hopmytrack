export default async function verifyProxy(proxy: string): Promise<boolean> {
  const res1 = await fetch("https://api.ipify.org", { proxy });
  const res2 = await fetch("https://api.ipify.org", { proxy });
  if (!res1.ok || !res2.ok) return false;

  const ip1 = await res1.text();
  const ip2 = await res2.text();

  return ip1 !== ip2;
}
