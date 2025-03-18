"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuthState } from "@/contexts/authContext"
import { AtSign, User, Lock, Music, ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function SignUpPage() {
  const { SignUpFunction } = useAuthState()
  const [formData, setFormData] = useState({
    userName: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
    userIcon: null,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // バリデーション
    if (!formData.userName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("すべてのフィールドを入力してください")
      setIsSubmitting(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません")
      setIsSubmitting(false)
      return
    }

    // サインアップ処理: 非同期処理にawaitを追加
    const result = await SignUpFunction(formData)
    if (!result) {
      setError("サインアップに失敗しました")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-800 p-4 text-white">
      <div className="relative w-full max-w-md">
        {/* Background decoration */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl"></div>

        {/* Form container */}
        <div className="relative z-10 w-full rounded-xl bg-zinc-900/50 p-8 backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <Music className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold">Spotify共有ルーム</h1>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold">新規アカウント作成</h2>
            <p className="mt-2 text-center text-zinc-400">音楽の共有体験を始めましょう</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 pl-10 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="ユーザー名"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <AtSign className="h-5 w-5" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 pl-10 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="ユーザーID"
                  value={formData.userId}
                  onChange={handleChange}
                />
              </div> */}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <AtSign className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 pl-10 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="メールアドレス"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 pl-10 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="パスワード"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 pl-10 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="パスワード（確認）"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center rounded-full bg-green-500 p-3 font-medium text-black transition-all hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    処理中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    アカウント作成
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-zinc-400">
                すでにアカウントをお持ちですか？{" "}
                <Link href="/auth/sign-in" className="font-medium text-green-500 hover:text-green-400 hover:underline">
                  ログイン
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

