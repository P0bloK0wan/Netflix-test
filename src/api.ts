import type { Title, Profile } from "./domain/types";
export interface Bootstrap { titles: Title[]; profiles: Profile[] }
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const asset = (value: unknown, extension: string) => typeof value === "string" &&
  new RegExp(`^/media/[a-z0-9-]+\\.${extension}$`).test(value);
const unique = (items: { id: string }[]) => new Set(items.map(i => i.id)).size === items.length;
function isTitle(value: unknown): value is Title {
  if (!object(value)) return false;
  return ["id", "name", "tagline", "synopsis", "rating", "duration", "demoCredit"].every(k => text(value[k])) &&
    (value.kind === "film" || value.kind === "series") && Number.isInteger(value.year) &&
    Array.isArray(value.genres) && value.genres.length > 0 && value.genres.every(text) &&
    asset(value.image, "jpg") && asset(value.video, "mp4") && (value.videoWebm === undefined || asset(value.videoWebm, "webm")) &&
    (value.featured === undefined || typeof value.featured === "boolean") &&
    typeof value.color === "string" && /^#[0-9a-f]{6}$/i.test(value.color);
}
function isProfile(value: unknown): value is Profile {
  return object(value) && text(value.id) && text(value.name) &&
    typeof value.color === "string" && /^#[0-9a-f]{6}$/i.test(value.color);
}
export function parseBootstrap(value: unknown): Bootstrap {
  if (!object(value) || !object(value.meta) || value.meta.schemaVersion !== 1 || !object(value.data))
    throw new Error("Resposta incompatível do catálogo.");
  const { titles, profiles } = value.data;
  if (!Array.isArray(titles) || !titles.length || !titles.every(isTitle) || !unique(titles) ||
    !Array.isArray(profiles) || !profiles.length || !profiles.every(isProfile) || !unique(profiles))
    throw new Error("Catálogo indisponível ou incompleto.");
  return { titles, profiles };
}
export async function fetchBootstrap(signal: AbortSignal): Promise<Bootstrap> {
  const response = await fetch("/api/v1/bootstrap", { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  return parseBootstrap(await response.json());
}
