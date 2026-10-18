import { describe, it, expect } from "vitest";
import { filterTitles } from "../src/domain/catalog";
import { createLibrary, STORAGE_KEY } from "../src/domain/storage";
import type { Title, StorageLike } from "../src/domain/types";
const titles = [
  { id: "a", name: "Além do Horizonte", genres: ["Aventura"], kind: "film" },
  { id: "b", name: "Órbita", genres: ["Ficção científica"], kind: "series" },
] as Title[];
const memory = (): StorageLike => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
};
describe("catalog search", () => {
  it("matches accents, case and surrounding whitespace", () =>
    expect(filterTitles(titles, "  ALEM ")).toEqual([titles[0]]));
  it("searches genres and applies type", () =>
    expect(filterTitles(titles, "ficcao", "series")).toEqual([titles[1]]));
  it("returns all on whitespace and none for unknown query", () => {
    expect(filterTitles(titles, "   ")).toEqual(titles);
    expect(filterTitles(titles, "inexistente")).toEqual([]);
    expect(filterTitles(titles, "", "film")).toEqual([titles[0]]);
  });
});
describe("profile library", () => {
  it("toggles a title and persists through adapter reload", () => {
    const storage = memory();
    const library = createLibrary(storage);
    library.toggle("p1", "a");
    expect(createLibrary(storage).read("p1").list).toEqual(["a"]);
    library.toggle("p1", "a");
    expect(library.read("p1").list).toEqual([]);
  });
  it("isolates both list and progress by profile", () => {
    const library = createLibrary(memory());
    library.toggle("p1", "a");
    library.progress("p1", "a", 20, 100);
    expect(library.read("p2")).toEqual({ list: [], progress: {} });
    expect(library.read("p1").progress.a.position).toBe(20);
  });
  it("restores progress after reload", () => {
    const storage = memory();
    createLibrary(storage).progress("p1", "a", 25, 100);
    expect(createLibrary(storage).read("p1").progress.a).toMatchObject({
      position: 25,
      duration: 100,
    });
  });
  it("recovers from malformed and unsupported stored data", () => {
    for (const raw of [
      "broken",
      "null",
      "[]",
      '{"version":42,"profiles":{}}',
      '{"version":1,"profiles":{"p1":null}}',
    ]) {
      const storage = memory();
      storage.setItem(STORAGE_KEY, raw);
      expect(createLibrary(storage).read("p1")).toEqual({
        list: [],
        progress: {},
      });
    }
  });
  it("rejects invalid nested fields without breaking valid profiles", () => {
    const storage = memory();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        profiles: {
          p1: {
            list: ["a", 1, "a"],
            progress: {
              a: { position: -1, duration: 20 },
              b: { position: 10, duration: 20, updatedAt: 1 },
            },
          },
        },
      }),
    );
    const result = createLibrary(storage).read("p1");
    expect(result.list).toEqual(["a"]);
    expect(result.progress.a).toBeUndefined();
    expect(result.progress.b.position).toBe(10);
  });
  it("keeps changes in memory when storage throws", () => {
    const library = createLibrary({
      getItem() {
        throw Error("denied");
      },
      setItem() {
        throw Error("quota");
      },
    });
    library.toggle("p1", "a");
    library.progress("p1", "a", 10, 20);
    expect(library.read("p1").list).toEqual(["a"]);
    expect(library.read("p1").progress.a.position).toBe(10);
  });
  it("ignores invalid media times and clamps to duration", () => {
    const library = createLibrary(memory());
    library.progress("p1", "a", NaN, 50);
    library.progress("p1", "b", 5, Infinity);
    library.progress("p1", "c", -5, 50);
    expect(library.read("p1").progress).toEqual({});
    library.progress("p1", "a", 110, 100);
    expect(library.read("p1").progress.a.position).toBe(100);
  });
  it("does not expose mutable internal state", () => {
    const library = createLibrary(memory());
    library.toggle("p1", "a");
    library.read("p1").list.push("b");
    expect(library.read("p1").list).toEqual(["a"]);
  });
});
