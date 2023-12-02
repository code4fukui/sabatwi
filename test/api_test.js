import {
  assertEquals,
  assertObjectMatch,
  assertStringIncludes,
} from "https://deno.land/std/testing/asserts.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import { startServer } from "../sabatwiServer.js";
import { sleep } from "https://js.sabae.cc/sleep.js";

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}/api`;

console.log(`Server is running at http://localhost:${PORT}`);
startServer(PORT);
await sleep(1000);

function assertObjectMatchWithoutDtAndId(actual, expected) {
  // dtとidを除いたオブジェクトが一致することを確認する
  const { dt, id, ...actualWithoutDtAndId } = actual;
  const { dt: expectedDt, id: expectedId, ...expectedWithoutDtAndId } = expected;

  assertEquals(actualWithoutDtAndId, expectedWithoutDtAndId);
}

Deno.test("Post Tweet", async () => {
  const response = await fetch(`${BASE_URL}/tweet/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "testUser", content: "Test tweet" }),
  });

  assertEquals(response.status, 200);
  const result = await response.json();
  assertEquals(result, "ok");
});

Deno.test("Get Tweet List", async () => {
  const response = await fetch(`${BASE_URL}/tweet/list`);
  assertEquals(response.status, 200);
  const result = await response.json();

  assertObjectMatchWithoutDtAndId(result[0], {
    value: { content: "Test tweet", user: "testUser" },
  });
});
