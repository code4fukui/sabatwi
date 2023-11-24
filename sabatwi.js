import { serveAPI } from "https://code4fukui.github.io/wsutil/wsutil.js";
import { DateTime } from "https://js.sabae.cc/DateTime.js";
import { nanoid } from "https://code4fukui.github.io/nanoid/nanoid.js";
import { openKv } from "./openKv.js";
import { migrate } from "./migrate.js";

const port = Deno.args[0] || 8080;

const kv = await openKv();
await migrate(kv);

const makeKeyByTime = (dt, type, user, id) => {
  const day = parseInt(dt.day.toStringYMD());
  const hour = dt.time.hour;
  const min = dt.time.min;
  const time = dt.getTime();
  return [type, day, hour, min, time, user, id];
};

serveAPI("/api/", async (param, req, path, conninfo) => {
  if (typeof param == "string" && param[0] == "{") {
    param = JSON.parse(param);
  }
  if (path == "/api/tweet/add") {
    const now = new DateTime();
    const id = nanoid();
    const key = makeKeyByTime(now, "tweet", param.user, id);
    kv.set(key, param);
    return "ok";
  } else if (path == "/api/tweet/list") {
    const entries = kv.list({ prefix: ["tweet"] });
    const list = [];
    for await (const e of entries) {
      const d = { dt: e.key[4], value: e.value, id: e.key[6] };
      list.push(d);
    }
    return list;
  }
  return "illegal";
}, port);
