"use client"

import { useState } from "react"

const RoomJoinModal = ({ isOpen, onClose, onSubmit }) => {
  const [passphrase, setPassphrase] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(passphrase)
    setPassphrase("")
  }

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }

  const contentStyle = {
    backgroundColor: "#FFFFFF",
    padding: "2rem",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "90%",
  }

  const titleStyle = {
    color: "#1DB954",
    marginTop: 0,
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }

  const inputStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #1DB954",
  }

  const buttonStyle = {
    backgroundColor: "#1DB954",
    color: "#FFFFFF",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  }

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>ルームに参加</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="合言葉を入力してください"
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            参加
          </button>
        </form>
      </div>
    </div>
  )
}

export default RoomJoinModal