import { it, expect } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/app";
it("keeps the API alive if a previously served file disappears", async () => {
  const root = await mkdtemp(join(tmpdir(), "demo-static-"));
  const file = join(root, "example.txt");
  await writeFile(file, "example");
  const server = createApp(root);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Missing port");
    const base = `http://127.0.0.1:${addr.port}`;
    expect(await fetch(`${base}/example.txt`).then(r => r.text())).toBe("example");
    await rm(file);
    expect((await fetch(`${base}/example.txt`)).status).toBe(404);
    expect((await fetch(`${base}/api/v1/health`)).status).toBe(200);
    expect((await fetch(`${base}/.env`)).status).toBe(404);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  }
});
