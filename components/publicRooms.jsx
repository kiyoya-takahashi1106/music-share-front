"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRoomsState } from "@/contexts/roomsContext"
import RoomCard from "./roomCard"
import { Music, Search, RefreshCw } from "lucide-react"

const PublicRooms = () => {
  const router = useRouter()
  const { rooms, getPublicRooms } = useRoomsState()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRooms, setFilteredRooms] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // マウント時にルームデータを取得
  useEffect(() => {
    try {
      getPublicRooms()
    } catch (error) {
      router.push("/auth/sign-in")
      console.error("Failed to fetch public rooms:", error)
    }
  }, [])

  // 検索キーワード/rooms 更新時にフィルタリング
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRooms(rooms || []) // roomsがnullの場合は[]を設定
    } else {
      const filtered = (rooms || []).filter(
        (room) =>
          room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.playingPlaylistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.playingSongName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRooms(filtered)
    }
  }, [rooms, searchTerm])

  // 手動更新
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await getPublicRooms()
    setIsRefreshing(false)
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Music size={32} className="text-green-500 mr-3" />
              公開ルーム
            </h1>
            <p className="text-zinc-400 mt-1">みんなで音楽を共有しよう</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="ルームを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800 text-white rounded-full py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors"
            >
              <RefreshCw size={18} className={`${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-zinc-800/50 inline-flex rounded-full p-4 mb-4">
              <Music size={32} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">ルームが見つかりません</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              {searchTerm
                ? "検索条件に一致するルームがありません。別のキーワードで試してみてください。"
                : "現在公開されているルームはありません。新しいルームを作成しましょう！"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRooms.map((room) => (
              // キーをキャメルケースの roomId に変更
              <RoomCard key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicRooms

