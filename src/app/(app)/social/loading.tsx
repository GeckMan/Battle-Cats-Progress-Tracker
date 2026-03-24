export default function SocialLoading() {
  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-24 bg-gray-800 rounded" />
        <div className="h-4 w-56 bg-gray-800/60 rounded mt-2" />
      </div>

      {/* Friends section skeleton */}
      <section className="space-y-3">
        <div className="h-5 w-20 bg-gray-800 rounded" />
        <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-3">
          <div className="h-4 w-28 bg-gray-800 rounded" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-900 rounded" />
            <div className="w-20 h-10 bg-gray-900 rounded" />
          </div>
        </div>
      </section>

      {/* Your progress skeleton */}
      <section className="space-y-3">
        <div className="h-5 w-12 bg-gray-800 rounded" />
        <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-5 w-32 bg-gray-800 rounded" />
              <div className="h-3 w-48 bg-gray-800/60 rounded mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-gray-800 rounded-md p-2.5 bg-black">
                <div className="h-3 w-12 bg-gray-800/60 rounded" />
                <div className="h-6 w-10 bg-gray-800 rounded mt-1" />
                <div className="h-1.5 bg-gray-800 rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Friends progress skeleton */}
      <section className="space-y-3">
        <div className="h-5 w-40 bg-gray-800 rounded" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-4 bg-black space-y-4">
              <div className="h-5 w-28 bg-gray-800 rounded" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="border border-gray-800 rounded-md p-2.5 bg-black">
                    <div className="h-3 w-10 bg-gray-800/60 rounded" />
                    <div className="h-5 w-8 bg-gray-800 rounded mt-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
