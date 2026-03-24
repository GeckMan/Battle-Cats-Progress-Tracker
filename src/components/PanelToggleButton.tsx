"use client";

export function PanelToggleButton({
  onClick,
  unreadActivity,
  unreadChat,
}: {
  onClick: () => void;
  unreadActivity: number;
  unreadChat: number;
}) {
  const totalUnread = unreadActivity + unreadChat;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-20 flex items-center gap-2.5 pl-2.5 pr-3 py-2 md:pl-3 md:pr-3.5 md:py-2.5 rounded-xl border border-amber-800/60 bg-gray-950/95 backdrop-blur-sm text-amber-300 hover:text-amber-200 hover:border-amber-700 hover:bg-gray-900/95 transition-all shadow-lg shadow-black/40 group"
      aria-label="Open panel"
    >
      {/* Icon */}
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:scale-110 transition-transform"
        >
          <polyline points="1,8 4,8 6,3 8,13 10,6 12,8 15,8" />
        </svg>
        {/* Combined red badge on the icon */}
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-0.5 leading-none animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-medium tracking-wide hidden md:inline">Activity & Chat</span>
    </button>
  );
}
