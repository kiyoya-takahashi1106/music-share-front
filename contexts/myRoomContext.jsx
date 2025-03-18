"use client";

import { createContext, useContext, useState } from "react";
import { fetchRoomDetails, joinRoom, leaveRoom } from "../lib/myRoomLib";  // API呼び出し

const MyRoomContext = createContext(null);

const MyRoomProvider = ({ children }) => {
  const [room, setRoom] = useState({
    isJoined: false,
    roomId: null,
    roomName: null,
    isPublic: null,
    genre: null,
    maxParticipants: null,
    startTime: null,
    participants: [],
    host_id: null,
    host_name: null,
    nowPlaying: { title: null, artist: null },
    playlist: [],
  });

  // ルーム詳細を取得
  const getRoomDetails = async (roomId) => {
    try {
      const roomData = await fetchRoomDetails(roomId);  // ルーム詳細を取得
      setRoom({ isJoined: true, ...roomData });
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  // ルームに参加
  const joinRoomData = async (roomId, userId) => {
    try {
      const joinedRoom = await joinRoom(roomId, userId);  // 参加処理
      setRoom({ isJoined: true, ...joinedRoom });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  // ルームから退出
  const leaveRoomData = async (roomId, userId) => {
    try {
      await leaveRoom(roomId, userId);  // 退出処理
      setRoom({
        isJoined: false,
        roomId: null,
        roomName: null,
        isPublic: null,
        genre: null,
        maxParticipants: null,
        startTime: null,
        participants: [],
        host: null,
        nowPlaying: { title: null, artist: null },
        playlist: [],
      });
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  // ルーム情報をアップロード
  const uploadRoomData = (newRoomData) => {
    setRoom(newRoomData);
  };

  return (
    <MyRoomContext.Provider value={{ room, getRoomDetails, joinRoomData, leaveRoomData, uploadRoomData }}>
      {children}
    </MyRoomContext.Provider>
  );
};

const useMyRoomState = () => {
  const context = useContext(MyRoomContext);
  if (!context) {
    throw new Error("useMyRoomState must be used within a MyRoomProvider");
  }
  return context;
};

export { MyRoomProvider, useMyRoomState };
