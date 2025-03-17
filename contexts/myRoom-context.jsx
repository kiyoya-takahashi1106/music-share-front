"use client";

import { createContext, useContext, useState } from "react";

const RoomContext = createContext(null);

const initRoomState = {
  isJoined: false,
  roomId: null,
  roomName: null,
  isPublic: null,
  genre: null,
  maxParticipants: null,
  startTime: null,
  participants: [],
  host: null,
  nowPlaying: {
    title: null,
    artist: null,
  },
  playlist: [],
};

const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(initRoomState);

  const makeRoomData = async () => {
    // API処理など
    setRoom({
      isJoined: true,
      roomId: "room1",
      roomName: "J-POP部屋",
      isPublic: true,
      genre: "J-POP",
      maxParticipants: 10,
      startTime: new Date(),
      participants: ["user1", "user2", "user3"],
      host: "user1",
      nowPlaying: {
        title: "Pretender",
        artist: "Official髭男dism",
      },
      playlist: [
        { title: "Lemon", artist: "米津玄師" },
        { title: "Marigold", artist: "あいみょん" },
      ],
    });
  };

  const joinRoomData = async () => {
    setRoom({
      isJoined: true,
      roomId: "room1",
      roomName: "J-POP部屋",
      isPublic: true,
      genre: "J-POP",
      maxParticipants: 10,
      startTime: new Date(),
      participants: ["user1", "user2", "user3"],
      host: "user1",
      nowPlaying: {
        title: "Pretender",
        artist: "Official髭男dism",
      },
      playlist: [
        { title: "Lemon", artist: "米津玄師" },
        { title: "Marigold", artist: "あいみょん" },
      ],
    });
  };

  const leaveRoomData = async () => {
    setRoom(initRoomState);
  };

  // 新しいルーム情報をコンテキストにアップロードする関数
  const uploadRoomData = (newRoomData) => {
    setRoom(newRoomData);
  };

  return (
    <RoomContext.Provider value={{ room, makeRoomData, joinRoomData, leaveRoomData, uploadRoomData }}>
      {children}
    </RoomContext.Provider>
  );
};

const useRoomState = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomState must be used within a RoomProvider");
  }
  return context;
};

export { RoomProvider, useRoomState };
