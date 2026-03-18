export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-screen px-4 md:px-6 py-8">
        {/* Image Gallery Skeleton */}
        <div className="lg:col-span-7">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-24">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 aspect-square bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="lg:col-span-5 px-4 py-8">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-24 mb-6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6 animate-pulse"></div>
          
          <div className="flex gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-14 h-14 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>

          <div className="flex gap-3 mb-6">
            <div className="h-11 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-11 flex-1 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="h-px bg-gray-200 my-6"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
