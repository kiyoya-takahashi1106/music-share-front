"use client"

import { useState } from "react"
// ルーム情報アップロード用のフックへ変更
import { useRoomState } from "@/contexts/myRoom-context"
import Header from "@/components/header"

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [passphrase, setPassphrase] = useState("")
  const [genre, setGenre] = useState("")
  const [maxParticipants, setMaxParticipants] = useState(2)
  const { uploadRoomData } = useRoomState()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Room created:", { roomName, isPublic, passphrase, genre, maxParticipants })
    updateRoomState()
  }

  const updateRoomState = () => {
    const newRoom = {
      roomName, // 新しいルーム名
      isPublic,
      passphrase: isPublic ? "" : passphrase,
      genre,
      maxParticipants,
      startTime: new Date(),
      participants: [],
      host: "", // 必要に応じて現在のユーザーIDなどを設定
      nowPlaying: { title: null, artist: null },
      playlist: []
    }
    // コンテキストに新しいルーム情報をアップロード
    uploadRoomData(newRoom)
  }

  return (
    <div>
      <Header />
      <main style={mainStyle}>
        <h1 style={titleStyle}>ルーム作成</h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="roomName" style={labelStyle}>
              ルーム名
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>ルームタイプ</label>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  style={radioInputStyle}
                />
                パブリック
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  style={radioInputStyle}
                />
                プライベート
              </label>
            </div>
          </div>
          {!isPublic && (
            <div style={inputGroupStyle}>
              <label htmlFor="passphrase" style={labelStyle}>
                合言葉
              </label>
              <input
                type="text"
                id="passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}
          <div style={inputGroupStyle}>
            <label htmlFor="genre" style={labelStyle}>
              音楽のジャンル
            </label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="maxParticipants" style={labelStyle}>
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
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>
            ルームを作成
          </button>
        </form>
      </main>
    </div>
  )
}

const mainStyle = {
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "0 1rem",
}

const titleStyle = {
  color: "#1DB954",
  fontSize: "2rem",
  marginBottom: "1.5rem",
  textAlign: "center",
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
}

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
}

const labelStyle = {
  color: "#333",
  fontSize: "1rem",
  fontWeight: "bold",
}

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "5px",
  border: "1px solid #1DB954",
  width: "100%",
  boxSizing: "border-box",
}

const radioGroupStyle = {
  display: "flex",
  gap: "1rem",
}

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}

const radioInputStyle = {
  margin: 0,
}

const buttonStyle = {
  backgroundColor: "#1DB954",
  color: "#FFFFFF",
  border: "none",
  padding: "0.75rem 1rem",
  borderRadius: "20px",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.3s",
}

export default CreateRoom