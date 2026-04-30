/**
 * Tutor search loading skeleton
 */
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-20 bg-gray-100 border-b border-gray-200" />

      {/* Search hero skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-96 mb-8" />
          <div className="h-12 bg-white rounded-lg w-full max-w-2xl" />
        </div>
      </div>

      {/* Category tabs skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24" />
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Results skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded" />
              ))}
            </div>
          </div>

          {/* Results skeleton */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48" />
                    <div className="h-4 bg-gray-100 rounded w-32" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-gray-100 rounded w-20" />
                  ))}
                </div>
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="h-8 bg-gray-200 rounded w-32" />
                  <div className="h-10 bg-blue-100 rounded w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
