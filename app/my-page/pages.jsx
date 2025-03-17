"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/auth-context"

export default function MyPage() {
  const { authState } = useAuthState()
  const router = useRouter()

  // 認証状態をチェックして、ログインしていなければリダイレクト
  useEffect(() => {
    if (!authState.isLogin) {
      router.push("/login")
    }
  }, [authState.isLogin, router])

  // ログインしていない場合はローディング表示
  if (!authState.isLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">ログインが必要です。リダイレクトしています...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">マイページ</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <div className="mr-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            {authState.userIcon ? (
              <img
                src={authState.userIcon || "/placeholder.svg"}
                alt={authState.userName}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {authState.userName ? authState.userName.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{authState.userName || "ユーザー"}</h2>
            <p className="text-gray-600">@{authState.userId || "user_id"}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-2 text-lg font-medium">アカウント情報</h3>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ユーザーID:</span>
              <span>{authState.userId || "未設定"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ユーザー名:</span>
              <span>{authState.userName || "未設定"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-medium">最近参加したルーム</h3>
        <div className="grid gap-4">
          <p className="text-gray-500">まだルームに参加していません</p>
          {/* ルーム履歴がある場合はここに表示 */}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => router.push("/create-room")}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          新しいルームを作成
        </button>
      </div>
    </div>
  )
}

