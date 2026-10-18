import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import postcss from "postcss";
it("ships more than 50 finite, connected animations with a reduced-motion override", () => {
  const css = readFileSync(
    new URL("../src/motion.css", import.meta.url),
    "utf8",
  );
  const root = postcss.parse(css);
  const defined = new Set<string>();
  const used = new Set<string>();
  root.walkAtRules("keyframes", (rule) => {
    defined.add(rule.params);
  });
  root.walkDecls("animation", (decl) => {
    expect(decl.value).not.toContain("infinite");
    used.add(decl.value.split(/\s/)[0]);
  });
  expect(defined.size).toBeGreaterThan(50);
  for (const name of defined)
    expect(used.has(name), `Unused animation: ${name}`).toBe(true);
  expect(css).toContain("prefers-reduced-motion: reduce");
  expect(css).toContain("animation: none !important");
});
