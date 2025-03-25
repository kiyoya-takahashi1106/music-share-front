export default function Loading() {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">ルームに接続中...</p>
        </div>
      </div>
    )
}  