"use client";

import { createContext, useContext, useState } from "react";
import {
  fetchRoomDetails,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  setNextSong,
  setNextPlaylist,
} from "../lib/myRoomLib";  // API呼び出し

const MyRoomContext = createContext(null);

const MyRoomProvider = ({ children }) => {
  const [room, setRoom] = useState({
    isJoined: false,
    // mysqlからもらうデータ
    roomId: null,
    roomName: null,
    isPublic: null,
    genre: null,
    maxParticipants: null,
    nowParticipants: null,
    host: {},
    playingPlaylistName: null,
    playingSongName: null,
    createdAt: null,
    // playing_service: null,
    // ここからはredisにもらうデータ
    roomStatus: null,
    playingPlaylistId: null,
    playingSongId: null,
    updateSongAt: null,
    participants: [],
  });

  // ルーム詳細を取得
  const getRoomDetails = async (roomId) => {
    try {
      const roomData = await fetchRoomDetails(roomId);
      console.log(roomData)
      setRoom({ isJoined: true, ...roomData });
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  // ルームを作成
  const createRoomData = async (roomData) => {
    try {
      const createdRoom = await createRoom(roomData);
      setRoom({ isJoined: true, ...createdRoom });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // ルームに参加
  const joinRoomData = async (roomId, userId) => {
    try {
      await joinRoom(userId, roomId);
      setRoom((prev) => ({ ...prev, isJoined: true }));
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  // ルームから退出
  const leaveRoomData = async (roomId, userId) => {
    try {
      await leaveRoom(userId, roomId);
      setRoom({ isJoined: false, roomId: null });
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  // ルームを削除
  const deleteRoomData = async (roomId) => {
    try {
      await deleteRoom(roomId);
      setRoom({ isJoined: false, roomId: null });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // 次の曲を設定
  const setNextSongData = async (roomId, songName) => {
    try {
      await setNextSong(roomId, songName);
      setRoom((prev) => ({ ...prev, playingSongName: songName }));
    } catch (error) {
      console.error("Error setting next song:", error);
    }
  };

  // 次のプレイリストを設定
  const setNextPlaylistData = async (roomId, playlistName) => {
    try {
      await setNextPlaylist(roomId, playlistName);
      setRoom((prev) => ({ ...prev, playingPlaylistName: playlistName }));
    } catch (error) {
      console.error("Error setting next playlist:", error);
    }
  };

  return (
    <MyRoomContext.Provider
      value={{
        room,
        getRoomDetails,
        createRoomData,
        joinRoomData,
        leaveRoomData,
        deleteRoomData,
        setNextSongData,
        setNextPlaylistData,
      }}
    >
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
