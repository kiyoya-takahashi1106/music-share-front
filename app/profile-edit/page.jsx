"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/authContext"
import { Camera, Save } from "lucide-react"
import Header from "@/components/header"

export default function EditProfilePage() {
  const { authState, updateProfile } = useAuthState()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  // 入力値は表示名とメールアドレスのみで管理する
  const [formData, setFormData] = useState({
    name: authState.userName || "",
    email: authState.email || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    // ここで画像アップロード処理を行う（未実装）
    console.log("File selected:", e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      updateProfile(formData)
      setIsLoading(false)
      router.push("/dash-board")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-6">プロフィールを編集</h1>
        </div>

        {/* プロフィール画像と編集 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-40 rounded-full bg-zinc-800 overflow-hidden mb-4">
            {authState.userIcon ? (
              <img
                src={authState.userIcon || "/placeholder.svg"}
                alt={authState.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-600 text-4xl font-bold">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <button
            onClick={handlePhotoClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Camera size={18} />
            アイコンを編集
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* 編集フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="w-full py-3 text-xl font-bold border-b border-zinc-800 mb-4">主な情報</div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">
                  表示名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-full font-medium text-lg ${
                isLoading ? "bg-zinc-700 text-zinc-400" : "bg-green-500 text-black hover:bg-green-400"
              } transition-colors`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  保存中
                </div>
              ) : (
                <div className="flex items-center">
                  <Save size={18} className="mr-2" />
                  変更を保存
                </div>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

