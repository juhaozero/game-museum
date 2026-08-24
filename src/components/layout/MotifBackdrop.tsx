/** 首页氛围：抽象主机/手柄线稿，无品牌商标 */
export function MotifBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        className="absolute -right-8 bottom-8 h-[420px] w-[420px] text-motif opacity-100"
        viewBox="0 0 200 200"
        fill="none"
      >
        <rect
          x="40"
          y="70"
          width="120"
          height="70"
          rx="18"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="70" cy="105" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="130" cy="105" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M88 105h24M100 93v24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="160" cy="40" r="28" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="160" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
