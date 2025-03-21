"use client"

import { useAuthState } from "@/contexts/authContext"
import { User, X, Settings, Bookmark, Music, ListMusic, Users, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

const UserMenuModal = ({ isOpen, onClose }) => {
  const { authState, logoutFunction } = useAuthState()
  const modalRef = useRef(null)

  // クリックイベントのハンドラー
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    // モーダルが開いている時だけイベントリスナーを追加
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        ref={modalRef}
        className={`fixed right-0 top-0 h-full w-[280px] transform bg-zinc-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">アカウント</h2>
            <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* ユーザー情報 */}
          <div className="mb-4 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-zinc-800">
                {authState.userIcon ? (
                  <img
                    src={authState.userIcon || "/placeholder.svg"}
                    alt={authState.userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-green-600 text-xl font-bold">
                    {authState.userName ? authState.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold">{authState.userName || "ユーザー名"}</div>
                <div className="text-sm text-zinc-400">@{authState.userId || "user_id"}</div>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-bold">142</span> <span className="text-zinc-400">フォロー中</span>
              </div>
              <div>
                <span className="font-bold">55</span> <span className="text-zinc-400">フォロワー</span>
              </div>
            </div>
          </div>

          {/* メニュー項目 */}
          <div className="flex-1 overflow-y-auto px-2">
            <nav className="space-y-1">
              <Link
                href="/dash-board"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Home size={20} />
                <span className="text-base font-medium">ホーム</span>
              </Link>

              <Link
                href="/mypage"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <User size={20} />
                <span className="text-base font-medium">プロフィール</span>
              </Link>

              <Link
                href="/premium"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Music size={20} />
                <span className="text-base font-medium">プレミアム</span>
              </Link>

              <Link
                href="/bookmarks"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Bookmark size={20} />
                <span className="text-base font-medium">お気に入り</span>
              </Link>

              <Link
                href="/create-room"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Users size={20} />
                <span className="text-base font-medium">ルーム作成</span>
              </Link>

              <Link
                href="/playlists"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <ListMusic size={20} />
                <span className="text-base font-medium">プレイリスト</span>
              </Link>
            </nav>

            <div className="my-2 border-t border-zinc-800"></div>

            <nav className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-md px-4 py-2.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <Settings size={20} />
                <span className="text-base font-medium">設定</span>
              </Link>

              <button
                onClick={logoutFunction}
                className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <LogOut size={20} />
                <span className="text-base font-medium">ログアウト</span>
              </button>
            </nav>
          </div>

          {/* フッター */}
          <div className="p-4">
            <Link
              href="/create-room"
              className="flex w-full items-center justify-center rounded-full bg-green-500 py-3 font-medium text-black transition-colors hover:bg-green-400"
            >
              新しいルームを作成
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMenuModal

