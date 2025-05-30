"use client"

import { useState, useEffect, } from "react"
import { useRouter } from "next/navigation";
import { useAuthState } from "@/contexts/authContext"
import { useMyRoomState } from "@/contexts/myRoomContext"
import Header from "@/components/header"
import { Music, Search, Play, Check, ChevronDown, X } from "lucide-react"


const CreateRoom = () => {
  const [roomName, setRoomName] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [passphrase, setPassphrase] = useState("")
  const [genre, setGenre] = useState("")
  const [maxParticipants, setMaxParticipants] = useState(2)
  const router = useRouter();
  const { authState, getUserInfo } = useAuthState()
  const { createRoomData } = useMyRoomState()

  // プレイリスト関連の状態
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isPlaylistDropdownOpen, setIsPlaylistDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // spotify-apiを叩く
  useEffect(() => {
    // ここでAPIからプレイリストを取得する処理を追加
    const fetchPlaylists = async () => {
      const result = await getUserInfo();
      if (!result.isSpotify) {
        console.error("Spotify service is not available");
        return;
      }

      const encryptedAccessToken = result.services.spotify.encryptedAccessToken;
      const accessToken = atob(encryptedAccessToken);

      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
        },});

        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const data = await response.json();
        const playlists = data.items.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          // description: playlist.description || "No description available",
          imageUrl: playlist.images[0]?.url || "/placeholder.svg",
          firstSong: playlist.tracks?.items?.[0]?.track || { id: null, name: "Unknown" },
        }));
        console.log("Fetched Playlists:", playlists); 

        setPlaylists(playlists);
      } catch (error) {
      console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [])


  // 検索結果をフィルタリング
  const filteredPlaylists =
    searchTerm.trim() === ""?
      playlists
    : 
      playlists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          playlist.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPlaylist) {
      alert("プレイリストを選択してください")
      return
    }
  
    setIsLoading(true)

    // プレイリストから楽曲情報を取得し、songs 変数にセットする
    let songs = {};

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${atob(authState.services.spotify.encryptedAccessToken)}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch songs from the playlist");
      }

      const data = await response.json();
      songs = data.items.reduce((acc, item, index) => {
        // item.track が存在しない場合を考慮
        if (!item.track) {
          console.warn(`Track data is missing for item at index ${index}`);
          return acc;
        }
    
        acc[index + 1] = {
          songId: item.track.id || "unknown", // IDがない場合のフォールバック
          songName: item.track.name || "Unknown Song", // 曲名がない場合のフォールバック
          artist: item.track.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist", // アーティスト名がない場合のフォールバック
          songLength: item.track.duration_ms || 0, // 再生時間がない場合のフォールバック
          songImageUrl: item.track.album?.images?.[0]?.url || "/placeholder.svg", // アルバム画像がない場合のフォールバック
        };
        return acc;
      }, {});
      
      console.log("Fetched Songs:", songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      alert("プレイリストの曲を取得できませんでした");
      setIsLoading(false);
      return;
    }

    try {
      const newRoom = {
        roomName: roomName,
        isPublic: isPublic,
        roomPassword: isPublic ? null : passphrase,
        genre: genre,
        maxParticipants: maxParticipants,
        hostUserId: authState.userId,
        hostUserName: authState.userName,
        playingPlaylistName: selectedPlaylist.name,
        playingSongName: songs[1].songName,
        playingSongIndex: 1,
        songs: songs
      };

      const roomId = await createRoomData(newRoom);
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Room creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 mt-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Music className="text-green-500 mr-3" size={32} />
            新しいルームを作成
          </h1>
          <p className="text-zinc-600 mt-2">お気に入りの音楽をみんなで共有しましょう</p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg text-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ルーム基本情報 */}
            <div className="space-y-6">
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-white mb-1">
                  ルーム名
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="例: 金曜の夜のチルアウト"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">ルームタイプ</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer text-white">
                    <input
                      type="radio"
                      value="public"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border ${isPublic ? "bg-green-500 border-green-500" : "bg-zinc-700 border-zinc-500"} flex items-center justify-center mr-2`}
                    >
                      {isPublic && <Check size={12} className="text-black" />}
                    </div>
                    <span>パブリック</span>
                  </label>
                  <label className="flex items-center cursor-pointer text-white">
                    <input
                      type="radio"
                      value="private"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border ${!isPublic ? "bg-green-500 border-green-500" : "bg-zinc-700 border-zinc-500"} flex items-center justify-center mr-2`}
                    >
                      {!isPublic && <Check size={12} className="text-black" />}
                    </div>
                    <span>プライベート</span>
                  </label>
                </div>
              </div>

              {!isPublic && (
                <div>
                  <label htmlFor="passphrase" className="block text-sm font-medium text-white mb-1">
                    合言葉
                  </label>
                  <input
                    type="text"
                    id="passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    required
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="友達に教える合言葉"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-white mb-1">
                    音楽のジャンル
                  </label>
                  <input
                    type="text"
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="例: J-POP, ロック, ジャズ"
                  />
                </div>

                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-white mb-1">
                    最大参加人数
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    min="2"
                    max="10"
                    required
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* プレイリスト選択セクション */}
            <div className="pt-4 border-t border-zinc-700">
              <h2 className="text-xl font-bold mb-4 flex items-center text-white">
                <Music className="text-green-500 mr-2" size={20} />
                プレイリストを選択
              </h2>

              {/* 選択されたプレイリスト表示 */}
              {selectedPlaylist ? (
                <div className="mb-4 bg-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <img
                      src={selectedPlaylist.imageUrl || "/placeholder.svg"}
                      alt={selectedPlaylist.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{selectedPlaylist.name}</h3>
                      <p className="text-sm text-zinc-200">{selectedPlaylist.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlaylist(null)}
                      className="p-2 text-zinc-200 hover:text-white rounded-full hover:bg-zinc-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative mb-4">
                  <div
                    className="flex items-center justify-between bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 cursor-pointer"
                    onClick={() => setIsPlaylistDropdownOpen(!isPlaylistDropdownOpen)}
                  >
                    <div className="flex items-center text-zinc-200">
                      <Music size={18} className="mr-2" />
                      <span>プレイリストを選択してください</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform text-zinc-200 ${isPlaylistDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* プレイリスト選択ドロップダウン */}
                  {isPlaylistDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-zinc-800 border-b border-zinc-700">
                        <div className="relative">
                          <Search
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                          />
                          <input
                            type="text"
                            placeholder="プレイリストを検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-full py-1.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      {filteredPlaylists.length === 0 ? (
                        <div className="p-4 text-center text-zinc-200">プレイリストが見つかりません</div>
                      ) : (
                        <div>
                          {filteredPlaylists.map((playlist) => (
                            <div
                              key={playlist.id}
                              className="p-2 hover:bg-zinc-700 cursor-pointer"
                              onClick={() => {
                                setSelectedPlaylist(playlist)
                                setIsPlaylistDropdownOpen(false)
                                setSearchTerm("")
                              }}
                            >
                              <div className="flex items-center">
                                <img
                                  src={playlist.imageUrl || "/placeholder.svg"}
                                  alt={playlist.name}
                                  className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                  <h3 className="font-medium text-white">{playlist.name}</h3>
                                  <p className="text-xs text-zinc-200">{playlist.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!selectedPlaylist && (
                <p className="text-sm text-zinc-200 mb-4">
                  ルームで共有したいSpotifyのプレイリストを選択してください。
                  参加者はあなたが選んだプレイリストの曲を一緒に聴くことができます。
                </p>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !selectedPlaylist}
                className={`w-full flex items-center justify-center rounded-full py-3 px-6 font-medium text-lg transition-colors ${
                  isLoading || !selectedPlaylist
                    ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-400 text-black"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-transparent animate-spin mr-2"></div>
                    作成中...
                  </>
                ) : (
                  <>
                    <Play size={20} className="mr-2" fill="currentColor" />
                    ルームを作成
                  </>
                )}
              </button>

              {!selectedPlaylist && (
                <p className="text-center text-sm text-red-400 mt-2">
                  ルームを作成するにはプレイリストを選択してください
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateRoom