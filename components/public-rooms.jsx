"use client";

import { useRoomsState } from "../contexts/rooms-context";
import { useState, useEffect } from "react";

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0rem 2rem 2rem 2rem",
};

const titleStyle = {
  color: "#1DB954",
  fontSize: "2.5rem",
  marginBottom: "2rem",
  textAlign: "center",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
};

const roomListStyle = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
};

const roomCardStyle = {
  backgroundColor: "#181818",
  borderRadius: "10px",
  padding: "1.5rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  border: "1px solid #282828",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const roomNameStyle = {
  color: "#1DB954",
  fontSize: "1.5rem",
  marginBottom: "1rem",
  borderBottom: "2px solid #1DB954",
  paddingBottom: "0.5rem",
};

const roomInfoStyle = {
  fontSize: "1rem",
  color: "#B3B3B3",
  marginBottom: "0.5rem",
};

const joinButtonStyle = {
  backgroundColor: "#1DB954",
  color: "#FFFFFF",
  border: "none",
  padding: "0.75rem 1rem",
  borderRadius: "25px",
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
  width: "100%",
  transition: "background-color 0.3s ease",
};

const PublicRooms = () => {
  const { rooms } = useRoomsState();
  const [publicRooms, setPublicRooms] = useState([]);

  useEffect(() => {
    const filteredRooms = rooms.filter((room) => room.isPublic);
    setPublicRooms(filteredRooms);
  }, [rooms]);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>公開ルーム</h2>
      <div style={roomListStyle}>
        {publicRooms.map((room) => (
          <div
            key={room.id}
            style={roomCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(29, 185, 84, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h3 style={roomNameStyle}>{room.name}</h3>
            <p style={roomInfoStyle}>ジャンル: {room.genre}</p>
            <p style={roomInfoStyle}>
              参加者数: {room.participants ? room.participants.length : 0} /{" "}
              {room.maxParticipants}
            </p>
            <p style={roomInfoStyle}>
              開始時間: {new Date(room.createdAt).toLocaleString("ja-JP")}
            </p>
            <button
              style={joinButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1ED760";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1DB954";
              }}
            >
              参加する
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicRooms;