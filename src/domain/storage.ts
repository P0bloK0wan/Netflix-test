import type { ProfileLibrary, StorageLike, WatchProgress } from "./types";
export const STORAGE_KEY = "netflix-demo.library.v1";
const empty = (): ProfileLibrary => ({ list: [], progress: {} });
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const validTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
function parse(raw: string | null): Record<string, ProfileLibrary> {
  try {
    const data: unknown = JSON.parse(raw ?? "null");
    if (!object(data) || data.version !== 1 || !object(data.profiles))
      return {};
    return Object.fromEntries(
      Object.entries(data.profiles)
        .filter(([, value]) => object(value))
        .map(([id, value]) => {
          const profile = value as Record<string, unknown>;
          const list = Array.isArray(profile.list)
            ? [
                ...new Set(
                  profile.list.filter(
                    (x): x is string => typeof x === "string",
                  ),
                ),
              ]
            : [];
          const progress = Object.fromEntries(
            Object.entries(
              object(profile.progress) ? profile.progress : {},
            ).filter(
              ([, entry]) =>
                object(entry) &&
                validTime(entry.position) &&
                validTime(entry.duration) &&
                entry.duration > 0 &&
                entry.position <= entry.duration &&
                validTime(entry.updatedAt),
            ),
          ) as Record<string, WatchProgress>;
          return [id, { list, progress }];
        }),
    );
  } catch {
    return {};
  }
}
export function createLibrary(storage?: StorageLike) {
  let profiles: Record<string, ProfileLibrary> = {};
  try {
    profiles = parse(storage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    /* Keep browser session usable when access is denied. */
  }
  const read = (profileId: string): ProfileLibrary =>
    structuredClone(
      Object.hasOwn(profiles, profileId) ? profiles[profileId] : empty(),
    );
  const save = (profileId: string, profile: ProfileLibrary) => {
    profiles = { ...profiles, [profileId]: profile };
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, profiles }));
    } catch {
      /* In-memory state remains authoritative for this session. */
    }
  };
  return {
    read,
    toggle(profileId: string, titleId: string) {
      const profile = read(profileId);
      profile.list = profile.list.includes(titleId)
        ? profile.list.filter((id) => id !== titleId)
        : [...profile.list, titleId];
      save(profileId, profile);
    },
    progress(
      profileId: string,
      titleId: string,
      position: number,
      duration: number,
    ) {
      if (!validTime(position) || !validTime(duration) || duration <= 0) return;
      const profile = read(profileId);
      profile.progress = {
        ...profile.progress,
        [titleId]: {
          position: Math.min(position, duration),
          duration,
          updatedAt: Date.now(),
        },
      };
      save(profileId, profile);
    },
  };
}
export function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
