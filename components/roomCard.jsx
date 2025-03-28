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

  // 日付をフォーマット（createAt を使用）
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
  const handleJoinRoom = (e) => {
    e.stopPropagation()

    if (!authState.isLogin) {
      router.push("/auth/sign-in")
      return
    }

    if (isJoining) return

    setIsJoining(true)
    try {
      // API呼び出し時はキャメルケースの roomId を利用
      const responseStatus = joinRoomData(room.roomId, authState.userId, authState.userName)
      if (responseStatus) {
        router.push(`/room/${room.roomId}`)
      }
    } catch (error) {
      router.push(`/auth/sign-in`)
      console.error("Failed to join room:", error)
    } finally {
      setIsJoining(false)
    }
  }

  // ルーム詳細ページに移動
  const handleCardClick = () => {
    router.push(`/room/${room.roomId}`)
  }

  // 参加者の割合を計算（プログレスバー用）
  const participantPercentage = (room.nowParticipants / room.maxParticipants) * 100

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
                  {formatDate(room.createAt)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{room.roomName}</h2>
            </div>
            <div className="flex items-center text-zinc-400 text-sm">
              <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1">
                <User size={16} className="mr-1 text-green-500" />
                <span>作成者: {room.hostUserName}</span>
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
                <div className="text-lg font-medium text-white mb-1">{room.playingSongName}</div>
                <div className="text-sm text-zinc-400">{room.playingPlaylistName}</div>
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
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, room.nowParticipants))].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {room.nowParticipants > 3 && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-white">
                      +{room.nowParticipants - 3}
                    </div>
                  )}
                </div>
                <span className="ml-3 text-zinc-400">
                  {room.nowParticipants} / {room.maxParticipants} 人が参加中
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${participantPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* 参加ボタンエリア */}
        <div className="bg-gradient-to-r from-green-900/30 to-zinc-800/30 p-6 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-bold text-white mb-1">このルームに参加する</h3>
              <p className="text-zinc-400 text-sm">{room.genre} の音楽を一緒に楽しみましょう</p>
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

