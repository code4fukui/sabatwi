import { openKv } from "./openKv.js";

const kv = await openKv();
const entries = kv.list({ prefix: ["tweet"] });
const list = [];
for await (const e of entries) {
  list.push(e);
}
console.log(list);
