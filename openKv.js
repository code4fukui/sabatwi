await Deno.mkdir("kv", { recursive: true });
export const openKv = async () => await Deno.openKv("./kv/kv.sqlite");
