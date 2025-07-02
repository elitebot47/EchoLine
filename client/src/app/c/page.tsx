export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black/10 via-white to-black/20">
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <div className="mb-8">
          <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.1" />
            <path
              d="M7 10h10M7 14h6"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="17" cy="14" r="1" fill="#3b82f6" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Chat Without Limits
        </h1>
        <p className="text-lg md:text-xl text-blue-900/80 mb-8 max-w-xl">
          Message anyone freely — no restrictions, no barriers, just seamless
          communication.
        </p>
      </main>
    </div>
  );
}
