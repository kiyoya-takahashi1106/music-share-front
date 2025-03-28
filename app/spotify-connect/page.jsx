"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/authContext"
import { Music, ArrowRight, CheckCircle, Loader } from "lucide-react"
import Link from "next/link"

// 環境変数からSpotifyのClient IDを取得
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
// リダイレクト先のURL（ユーザーが認証後に戻る先）
const REDIRECT_URI = `http://localhost:3000/spotify-callback`
// 必要なスコープをスペース区切り（URLエンコード済み）で定義
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
].join("%20")

export default function SpotifyConnectPage() {
  const router = useRouter()
  const { authState } = useAuthState()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  // Spotify認証ページへのリダイレクト関数
  const connectToSpotify = () => {
    setIsConnecting(true)
    setError("")
    try {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=${SCOPES}&show_dialog=true`
      // 認証ページへ遷移
      window.location.href = authUrl
    } catch (err) {
      console.error("Spotify接続エラー:", err)
      setError("Spotifyとの接続中にエラーが発生しました。もう一度お試しください。")
      setIsConnecting(false)
    }
  }

  // すでに連携済みならダッシュボードに遷移
  useEffect(() => {
    if (authState.isSpotify) {
      router.push("/dash-board")
    }
  }, [])


  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-md mx-auto pt-16 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
            <Music size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Spotifyと連携する</h1>
          <p className="text-zinc-400">
            音楽共有ルームを利用するには、あなたのSpotifyアカウントとの連携が必要です。
          </p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">連携で利用できる機能</h2>
          <ul className="space-y-3">
            {[
              "友達と一緒に音楽を聴く",
              "プレイリストを共有する",
              "リアルタイムで再生状態を同期",
              "ルームでの音楽コントロール",
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={18} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-500">
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={connectToSpotify}
            disabled={isConnecting}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-medium py-3 px-4 rounded-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader className="animate-spin mr-2" size={18} />
                接続中...
              </>
            ) : (
              <>
                Spotifyと連携する
                <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </button>

          <Link
            href="/dash-board"
            className="w-full bg-transparent border border-zinc-700 hover:border-zinc-500 text-white font-medium py-3 px-4 rounded-full text-center transition-colors"
          >
            後で連携する
          </Link>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          連携することで、Spotifyの利用規約とプライバシーポリシーに同意したことになります。
        </p>
      </div>
    </div>
  )
}