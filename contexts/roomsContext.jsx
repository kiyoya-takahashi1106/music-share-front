"use client";

import { createContext, useContext, useState } from "react";
import { fetchRooms, createRoom, joinRoom, leaveRoom, deleteRoom } from "../lib/myRoomLib"; // API呼び出し

const RoomsContext = createContext(null);

const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  // ルーム情報を取得する
  const getRooms = async () => {
    try {
      const roomData = await fetchRooms(); // 複数ルームの情報をAPIから取得
      setRooms(roomData);  // 取得したルームデータをステートに保存
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // ルーム作成
  const createNewRoom = async (roomData) => {
    try {
      const newRoom = await createRoom(roomData);  // ルーム作成API呼び出し
      setRooms((prevRooms) => [...prevRooms, newRoom]);  // 作成したルームを追加
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // ルームに参加
  const joinRoomData = async (roomId, userId) => {
    try {
      const joinedRoom = await joinRoom(roomId, userId);  // 参加API呼び出し
      setRooms((prevRooms) => 
        prevRooms.map((room) => 
          room.id === roomId ? { ...room, participants: [...room.participants, userId] } : room
        )
      );
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  // ルームから退出
  const leaveRoomData = async (roomId, userId) => {
    try {
      await leaveRoom(roomId, userId);  // 退出API呼び出し
      setRooms((prevRooms) => 
        prevRooms.map((room) => 
          room.id === roomId ? { ...room, participants: room.participants.filter((user) => user !== userId) } : room
        )
      );
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  // ルーム削除
  const deleteRoomData = async (roomId) => {
    try {
      await deleteRoom(roomId);  // ルーム削除API呼び出し
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));  // 削除したルームをステートから削除
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <RoomsContext.Provider value={{ rooms, getRooms, createNewRoom, joinRoomData, leaveRoomData, deleteRoomData }}>
      {children}
    </RoomsContext.Provider>
  );
};

const useRoomsState = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRoomsState must be used within a RoomsProvider");
  }
  return context;
};

export { RoomsProvider, useRoomsState };
