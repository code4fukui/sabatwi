import { nanoid } from "https://code4fukui.github.io/nanoid/nanoid.js";

export const migrate = async (kv) => {
  const entries = kv.list({ prefix: ["tweet"] });
  const set = new Set();
  for await (const e of entries) {
    if (e.key.length == 6) {
      await kv.delete(e.key);
      e.key[1] = parseInt(e.key[1]); // to int
      e.key.push(nanoid()); // add nanoid
      await kv.set(e.key, e.value);
    } else {
      if (set.has(e.key[4])) {
        console.log("double", e.value);
        await kv.delete(e.key);
      } else {
        set.add(e.key[4]);
      }
    }
  }
};
