export default function DashboardLoading() {
  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-32 bg-gray-800 rounded" />
        <div className="h-4 w-64 bg-gray-800/60 rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-800 rounded-lg p-4 bg-black">
            <div className="h-3 w-14 bg-gray-800/60 rounded" />
            <div className="h-8 w-16 bg-gray-800 rounded mt-2" />
            <div className="h-1.5 bg-gray-800 rounded mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
