/** Public assets must remain inside the deployment subpath (e.g. GitHub Pages). */
export function assetUrl(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
