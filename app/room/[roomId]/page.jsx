"use client"

import { useState, useEffect, useRef, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthState } from "@/contexts/authContext"
import { useMyRoomState } from "@/contexts/myRoomContext"
import Header from "@/components/header"
import { Music, Users, LogOut, Clock } from "lucide-react"

const RoomPage = () => {
  const params = useParams()
  const router = useRouter()
  const { authState } = useAuthState()
  const { room, getRoomDetails, leaveRoomData, deleteRoomData } = useMyRoomState()

  // ローカルステート
  const [isPlaying, setIsPlaying] = useState(true)
  const [songProgress, setSongProgress] = useState(35)
  const [isLeavingRoom, setIsLeavingRoom] = useState(false)
  
  const progressInterval = useRef(null)

  useEffect(() => {
    getRoomDetails(params.roomId);
  }, []);
  
  // 曲の再生時間（デモ用）
  const songDuration = 217 // 秒
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // 現在の再生時間
  const currentTime = Math.floor((songProgress / 100) * songDuration)

  // 曲の進行状況を更新
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setSongProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval.current)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    } else {
      clearInterval(progressInterval.current)
    }

    return () => clearInterval(progressInterval.current)
  }, [isPlaying])

  // ルームから退出する
  const handleLeaveRoom = () => {
    setIsLeavingRoom(true)

    // 実際のアプリではここでAPIを呼び出してルームから退出する処理を行う
    setTimeout(() => {
      const result = leaveRoomData(authState.userId, room.roomId)
      if(result){
        router.push("/dash-board") // ダッシュボードページへリダイレクト
      }
    }, 1000)
  }

  // ルームを削除する
  const handleDeleteRoom = () => {
    setIsLeavingRoom(true)

    // 実際のアプリではここでAPIを呼び出してルームを削除する処理を行う
    setTimeout(() => {
      const result = deleteRoomData(room.roomId)
      if(result){
        router.push("/dash-board") // ダッシュボードページへリダイレクト
      }
    }, 1000)
  }

  // 参加者のアバター色をランダムに生成
  const getAvatarColor = (name) => {
    const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500", "bg-red-500"]
    if (!name || name.length === 0) return colors[0]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // 参加者リストの生成（roomData がある場合、本データの形式に合わせて生成）
  // const participants = [
  //   {
  //     id: room.host.hostId,
  //     name: room.host.hostName,
  //     isHost: true,
  //   },
  //   ...((room.participants || []).map((p) => ({
  //     id: p.userId,
  //     name: p.username,
  //     isHost: false,
  //   }))),
  // ]

  // 現在再生中の曲情報（デモ用）
  const currentSong = {
    title: room?.playingSongName || "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
  }

  // プレイリスト情報（デモ用）
  const playlist = {
    name: room?.playingPlaylistName || "トップヒット曲",
    songs: [
      { id: 1, title: "Shape of You", artist: "Ed Sheeran", duration: "3:53", isPlaying: true },
      { id: 2, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
      { id: 3, title: "Dance Monkey", artist: "Tones and I", duration: "3:29" },
      { id: 4, title: "Someone You Loved", artist: "Lewis Capaldi", duration: "3:02" },
      { id: 5, title: "Bad Guy", artist: "Billie Eilish", duration: "3:14" },
    ],
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* メインコンテンツエリア */}
          <div className="flex-1">
            {/* ルーム情報 */}
            <div className="mb-6 bg-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{room?.roomName || "音楽共有ルーム"}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                    {room?.genre || "ポップ"}
                  </span>
                  <span className="text-sm bg-zinc-700 px-2 py-1 rounded-full flex items-center">
                    <Users size={14} className="mr-1" />
                    {room.nowParticipants}/{room?.maxParticipants || 10}
                  </span>
                </div>
              </div>
            </div>

            {/* 現在再生中 */}
            <div className="mb-6 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={currentSong.coverUrl || "/placeholder.svg"}
                    alt={currentSong.title}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  {/* <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold mb-1">{currentSong.title}</h2>
                      <p className="text-xl text-zinc-300 mb-2">{currentSong.artist}</p>
                      <p className="text-zinc-400">{currentSong.album}</p>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white">
                      <Heart size={24} />
                    </button>
                  </div> */}

                  {/* 再生コントロール */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
                      <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${songProgress}%` }}></div>
                      </div>
                      <span className="text-xs text-zinc-400">{formatTime(songDuration)}</span>
                    </div>

                    {/* <div className="flex justify-center items-center gap-4 mt-4">
                      <button className="p-2 text-zinc-300 hover:text-white">
                        <SkipForward size={20} className="rotate-180" />
                      </button>
                      <button
                        className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="p-2 text-zinc-300 hover:text-white">
                        <SkipForward size={20} />
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* 音量コントロール
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: isMuted ? "0%" : "70%" }}></div>
                </div>
              </div> */}
            </div>

            {/* プレイリスト */}
            <div className="bg-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <Music className="mr-2 text-green-500" size={20} />
                  {playlist.name}
                </h2>
                <div className="flex items-center gap-2">
                  {/* <button className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-700">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-700">
                    <Settings size={18} />
                  </button> */}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800 sticky top-0">
                    <tr className="text-left text-zinc-400 text-sm">
                      <th className="p-3 w-10">#</th>
                      <th className="p-3">タイトル</th>
                      <th className="p-3 hidden md:table-cell">アーティスト</th>
                      <th className="p-3 text-right">
                        <Clock size={16} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {playlist.songs.map((song, index) => (
                      <tr key={song.id} className={`hover:bg-zinc-700 ${song.isPlaying ? "bg-zinc-700/50" : ""}`}>
                        <td className="p-3 text-zinc-400">{index + 1}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {song.isPlaying && (
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            )}
                            <span className={song.isPlaying ? "text-green-500" : ""}>{song.title}</span>
                          </div>
                        </td>
                        <td className="p-3 text-zinc-400 hidden md:table-cell">{song.artist}</td>
                        <td className="p-3 text-zinc-400 text-right">{song.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:w-80 flex flex-col">
            {/* 参加者リスト */}
            <div className="bg-zinc-800 rounded-xl overflow-hidden flex-1">
              <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                <h2 className="font-bold flex items-center">
                  <Users className="mr-2 text-green-500" size={18} />
                  参加者 ({room.nowParticipants || 0})
                </h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
                <ul>
                  {room.host && (
                    <li key={`host-${room.host.hostId}`} className="flex items-center justify-between p-3 hover:bg-zinc-700">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(room.host.hostName)} flex items-center justify-center mr-3`}
                        >
                          {room.host.hostName.charAt(0)}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">{room.host.hostName}</span>
                          <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">
                            ホスト
                          </span>
                        </div>
                      </div>
                    </li>
                  )}
                  {room.participants?.map((participant, index) => (
                    <li key={`participant-${index}`} className="flex items-center justify-between p-3 hover:bg-zinc-700">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(participant.username)} flex items-center justify-center mr-3`}
                        >
                          {participant.username.charAt(0)}
                        </div>
                        <span className="font-medium">{participant.username}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ルーム退出／削除ボタン */}
            <div className="mt-4 bg-zinc-800 rounded-xl p-4">
              {room?.host?.hostId === authState.userId ? (
                <button
                  onClick={handleDeleteRoom}
                  disabled={isLeavingRoom}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLeavingRoom ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      削除中...
                    </>
                  ) : (
                    <>
                      <LogOut size={18} />
                      ルームを削除する
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleLeaveRoom}
                  disabled={isLeavingRoom}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLeavingRoom ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      退出中...
                    </>
                  ) : (
                    <>
                      <LogOut size={18} />
                      ルームから退出する
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RoomPage