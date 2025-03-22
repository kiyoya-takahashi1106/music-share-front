"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/authContext"
import { useMyRoomState } from "@/contexts/myRoomContext"
import { Music, Play, User, Users, Calendar, Headphones } from "lucide-react"

const RoomCard = ({ room }) => {
  const router = useRouter()
  const { authState } = useAuthState()
  const { joinRoomData } = useMyRoomState()
  const [isHovered, setIsHovered] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ルームに参加
  const handleJoinRoom = async (e) => {
    e.stopPropagation()

    if (!authState.isLogin) {
      router.push("/auth/sign-in")
      return
    }

    if (isJoining) return

    setIsJoining(true)
    try {
      const success = await joinRoomData(room.room_id, authState.userId, authState.userName)
      if (success) {
        console.log("Joined room successfully")
        router.push(`/room/${room.room_id}`)
      }
    } catch (error) {
      console.error("Failed to join room:", error)
    } finally {
      setIsJoining(false)
    }
  }

  // ルーム詳細ページに移動
  const handleCardClick = () => {
    router.push(`/room/${room.room_id}`)
  }

  // 参加者の割合を計算（プログレスバー用）
  const participantPercentage = (room.now_participants / room.max_participants) * 100

  return (
    <div
      className={`bg-zinc-900 rounded-xl overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-xl shadow-green-900/20 scale-[1.01]" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex flex-col">
        {/* ルーム情報 */}
        <div className="p-6">
          {/* ヘッダー */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500 text-xs font-bold text-black px-2 py-1 rounded-full">{room.genre}</span>
                <span className="text-zinc-400 text-sm flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(room.create_at)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{room.room_name}</h2>
            </div>
            <div className="flex items-center text-zinc-400 text-sm">
              <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1">
                <User size={16} className="mr-1 text-green-500" />
                <span>作成者: {room.host_user_name}</span>
              </div>
            </div>
          </div>

          {/* 現在再生中 */}
          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase mb-3 flex items-center">
              <Headphones size={16} className="mr-2 text-green-500" />
              現在再生中
            </h3>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-md flex items-center justify-center mr-4">
                <Music size={24} className="text-green-500" />
              </div>
              <div>
                <div className="text-lg font-medium text-white mb-1">{room.playing_song_name}</div>
                <div className="text-sm text-zinc-400">{room.playing_playlist_name}</div>
              </div>
            </div>
          </div>

          {/* 参加者情報 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase mb-2 flex items-center">
              <Users size={16} className="mr-2 text-green-500" />
              参加者
            </h3>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {/* 参加者アイコン（ダミー） */}
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, room.now_participants))].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {room.now_participants > 3 && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-white">
                      +{room.now_participants - 3}
                    </div>
                  )}
                </div>
                <span className="ml-3 text-zinc-400">
                  {room.now_participants} / {room.max_participants} 人が参加中
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${participantPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* 参加ボタンエリア - 下部に配置 */}
        <div className="bg-gradient-to-r from-green-900/30 to-zinc-800/30 p-6 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-bold text-white mb-1">このルームに参加する</h3>
              <p className="text-zinc-400 text-sm">{room.genre}の音楽を一緒に楽しみましょう</p>
            </div>

            <button
              className={`py-3 px-6 rounded-full font-medium text-lg flex items-center justify-center transition-colors sm:min-w-[180px] ${
                isJoining
                  ? "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-400 text-black"
              }`}
              onClick={handleJoinRoom}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-transparent animate-spin mr-2"></div>
                  参加中...
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" fill="currentColor" />
                  参加する
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomCard

