import { serveAPI } from "https://code4fukui.github.io/wsutil/wsutil.js";
import { DateTime } from "https://js.sabae.cc/DateTime.js";
import { nanoid } from "https://code4fukui.github.io/nanoid/nanoid.js";
import { openKv } from "./openKv.js";
import { migrate } from "./migrate.js";
import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { UUID } from "https://code4sabae.github.io/js/UUID.js";

let WebPush = null;
try {
  WebPush = (await import("https://code4fukui.github.io/WebPush/WebPush.js")).default;
} catch (e) {
  console.log("WebPush disabled");
}

const port = Deno.args[0] || 8080;

await Deno.mkdir("data/subscription", { recursive: true });
const list = (await dir2array("data/subscription"))
  .filter(i => i.endsWith(".json"))
  .map(i => i.substring(0, i.length - 5));

const push = (myuuid, message) => {
  const data = {
    title: "さばつい",
    url: "https://sabatwi.com/",
    body: message,
  };

  if (!WebPush) return;

  for (const l of list) {
    if (l == myuuid) continue;
    WebPush.push(l, data);
  }
};

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

    await kv.set(key, param);

    if (param.uuid && param.tweet) {
      push(param.uuid, param.tweet + "(" + param.user + ")");
    }

    return "ok";
  }

  if (path == "/api/tweet/list") {
    const entries = kv.list({ prefix: ["tweet"] });
    const list = [];

    for await (const e of entries) {
      list.push({
        dt: e.key[4],
        value: e.value,
        id: e.key[6],
      });
    }

    return list;
  }

  if (path == "/api/health") {
    return "ok";
  }

  if (path == "/api/subscribe") {
    const subscription = param;
    const uuid = UUID.generate();

    await Deno.writeTextFile(
      "data/subscription/" + uuid + ".json",
      JSON.stringify(subscription)
    );

    console.log("subscribe", uuid);
    list.push(uuid);

    return { uuid };
  }

  if (path == "/api/unsubscribe") {
    const uuid = param.uuid;

    await Deno.remove("data/subscription/" + uuid + ".json");

    console.log("unsubscribe", uuid);

    const n = list.indexOf(uuid);
    if (n >= 0) list.splice(n, 1);

    return { uuid };
  }

  return "illegal";
}, port);
