export default function UnitsLoading() {
  return (
    <div className="p-4 pt-16 md:p-8 space-y-4 animate-pulse">
      <div>
        <div className="h-7 w-20 bg-gray-800 rounded" />
        <div className="h-4 w-48 bg-gray-800/60 rounded mt-2" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-gray-900 rounded" />
        <div className="h-10 w-28 bg-gray-900 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border border-gray-800 rounded-lg p-3 bg-black">
            <div className="w-12 h-12 bg-gray-800 rounded mx-auto" />
            <div className="h-4 w-20 bg-gray-800 rounded mt-2 mx-auto" />
            <div className="h-3 w-14 bg-gray-800/60 rounded mt-1 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
