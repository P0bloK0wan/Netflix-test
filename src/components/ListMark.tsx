/** Original SVG, informed by the APK's 31-frame/60fps list confirmation. */
export function ListMark({ saved, size = 22 }: { saved: boolean; size?: number }) {
  return <svg className="list-mark" data-saved={saved} width={size} height={size}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <g className="list-mark-plus"><path d="M12 5v14M5 12h14" /></g>
    <path className="list-mark-check" pathLength="1" d="m5 12 4 4L19 6" />
  </svg>;
}
