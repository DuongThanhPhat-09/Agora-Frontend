/**
 * Tutor detail loading skeleton
 */
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-20 bg-gray-100 border-b border-gray-200" />

      {/* Hero section skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Video + Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-100 rounded w-64" />
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded w-24" />
              ))}
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-32" />
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-12 bg-blue-100 rounded" />
            </div>
          </div>
        </div>

        {/* About section skeleton */}
        <div className="mt-12 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        </div>

        {/* Portfolio section skeleton */}
        <div className="mt-12 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
