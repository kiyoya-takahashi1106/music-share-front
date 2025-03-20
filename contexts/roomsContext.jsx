"use client";

import { createContext, useContext, useState } from "react";
import { getPublicRooms as fetchPublicRooms } from "../lib/roomsLib"; // API呼び出し

const RoomsContext = createContext(null);

const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  // ルーム情報を取得する関数
  const getPublicRooms = async () => {
    try {
      const response = await fetchPublicRooms(); // importしたAPI関数を呼び出す
      setRooms(response.rooms);  // 取得したルームデータをステートに保存
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  return (
    <RoomsContext.Provider value={{ rooms, getPublicRooms }}>
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
