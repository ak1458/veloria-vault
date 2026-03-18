export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-[#b59a5c]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#b59a5c] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
