"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/authContext"
import Link from "next/link"
import { Music, User, ExternalLink, RefreshCw, LogOut, Shield, Clock, CheckCircle, XCircle } from "lucide-react"
import Header from "@/components/header"

export default function ConnectedAccountPage() {
  const router = useRouter()
  const { authState, getUserInfo, disconnectSpotify } = useAuthState()
  const [isLoading, setIsLoading] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)

  // ログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    getUserInfo();
  }, [])

  // Spotifyの接続状態
  const isSpotifyConnected = authState.isSpotify && authState.services?.spotify?.serviceUserId

  // トークンの有効期限を計算
  const getTokenStatus = () => {
    if (!authState.services?.spotify?.expiresAt) return { isValid: false, timeLeft: null }

    const expiresAt = new Date(authState.services.spotify.expiresAt)
    const now = new Date()
    const timeLeftMs = expiresAt - now

    // 残り時間を時間と分で表示
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))

    return {
      isValid: timeLeftMs > 0,
      timeLeft: timeLeftMs > 0 ? `${hours}時間${minutes}分` : null,
    }
  }

  const tokenStatus = getTokenStatus()

  // Spotifyの接続を解除
  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await disconnectSpotify()
      setShowDisconnectConfirm(false)
    } catch (error) {
      console.error("切断エラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // トークンを更新
  const handleRefreshToken = async () => {
    setIsLoading(true)
    try {
      // 実際のアプリではAPIを呼び出してトークンを更新する処理が必要
      await new Promise((resolve) => setTimeout(resolve, 1000)) // モック処理

      // 更新成功のフィードバック
      alert("トークンが更新されました")
    } catch (error) {
      console.error("更新エラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header title="アカウント連携" />

      {/* メインコンテンツ - 背景を白に変更 */}
      <main className="bg-white text-zinc-900 py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* 連携サービス */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Music className="mr-2 text-green-500" size={20} />
              音楽サービス連携
            </h3>

            {/* Spotify連携カード - 黒系のデザインに変更 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 shadow-md text-white">
              {/* カードヘッダー */}
              <div className="p-6 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center mr-4">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-black">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Spotify</h4>
                    <p className="text-zinc-400 text-sm">音楽ストリーミングサービス</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {isSpotifyConnected ? (
                    <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle size={14} className="mr-1" />
                      連携済み
                    </span>
                  ) : (
                    <span className="bg-zinc-700/50 text-zinc-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <XCircle size={14} className="mr-1" />
                      未連携
                    </span>
                  )}
                </div>
              </div>

              {/* アカウント詳細 */}
              {isSpotifyConnected ? (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-sm text-zinc-400 mb-1">Spotifyユーザー名</p>
                        <p className="font-medium text-white">{authState.services.spotify.serviceUserName || "不明"}</p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-sm text-zinc-400 mb-1">SpotifyユーザーID</p>
                        <p className="font-medium text-white">{authState.services.spotify.serviceUserId || "不明"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock size={18} className="mr-2 text-zinc-400" />
                          <span className="text-sm text-zinc-300">アクセストークン有効期限</span>
                        </div>
                        {tokenStatus.isValid ? (
                          <span className="text-sm text-green-500">残り {tokenStatus.timeLeft}</span>
                        ) : (
                          <span className="text-sm text-red-500">期限切れ</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={handleRefreshToken}
                          disabled={isLoading}
                          className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw size={16} className="mr-2 animate-spin" />
                          ) : (
                            <RefreshCw size={16} className="mr-2" />
                          )}
                          トークンを更新
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.spotify.com/account/overview/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors"
                    >
                      <span className="flex items-center">
                        <User size={18} className="mr-3 text-zinc-400" />
                        <span className="text-zinc-300">Spotifyアカウント管理</span>
                      </span>
                      <ExternalLink size={16} className="text-zinc-400" />
                    </a>

                    <a
                      href="https://www.spotify.com/account/apps/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors"
                    >
                      <span className="flex items-center">
                        <Shield size={18} className="mr-3 text-zinc-400" />
                        <span className="text-zinc-300">アプリ連携の管理</span>
                      </span>
                      <ExternalLink size={16} className="text-zinc-400" />
                    </a>
                  </div>

                  {/* 切断ボタン */}
                  <div className="mt-6">
                    {showDisconnectConfirm ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <p className="text-sm mb-3 text-zinc-300">
                          Spotifyとの連携を解除すると、音楽共有ルームの一部機能が利用できなくなります。本当に連携を解除しますか？
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDisconnect}
                            disabled={isLoading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                          >
                            {isLoading ? "処理中..." : "連携を解除する"}
                          </button>
                          <button
                            onClick={() => setShowDisconnectConfirm(false)}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDisconnectConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-500/30 rounded-md py-2 px-4 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        Spotifyとの連携を解除
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <Music size={24} className="text-zinc-500" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Spotifyと連携していません</h4>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                      Spotifyと連携すると、音楽共有ルームでプレイリストの共有や音楽の同期再生などの機能が利用できるようになります。
                    </p>
                    <Link
                      href="/spotify-connect"
                      className="inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ED760] text-black font-medium py-3 px-6 rounded-full transition-colors"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Spotifyと連携する
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 他の音楽サービス（将来的な拡張用） */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">その他の音楽サービス</h3>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-md text-white">
              <div className="text-center py-4">
                <p className="text-zinc-300 mb-2">現在、Spotify以外の音楽サービスとの連携はサポートされていません。</p>
                <p className="text-zinc-500 text-sm">今後のアップデートをお待ちください。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

