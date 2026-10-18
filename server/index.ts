import { createApp } from "./app.ts";
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("PORT inválida");
const server = createApp();
server.listen(port, process.env.HOST ?? "0.0.0.0", () => {
  console.log(`Site e API disponíveis na porta ${port}`);
});
for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
