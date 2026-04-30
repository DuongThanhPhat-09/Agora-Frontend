/**
 * Homepage loading skeleton
 */
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-20 bg-gray-100 border-b border-gray-200" />

      {/* Hero section skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-300 rounded w-full" />
            <div className="h-12 bg-gray-300 rounded w-5/6" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="flex gap-4">
              <div className="h-12 bg-blue-200 rounded w-40" />
              <div className="h-12 bg-gray-200 rounded w-40" />
            </div>
          </div>
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Stats section skeleton */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-12 bg-gray-300 rounded w-24 mx-auto" />
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features section skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 gap-8">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
