import { startSever } from "./sabatwiServer.js";

const port = Deno.args[0] || 8080;
startSever(port);
