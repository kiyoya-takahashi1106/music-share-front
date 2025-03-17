"use client";

import { createContext, useContext, useState } from "react";

const RoomContext = createContext(null);

const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    {
      id: "room1",
      name: "J-POP部屋",
      isPublic: true,
      genre: "J-POP",
      maxParticipants: 10,
      createdAt: new Date(),
      owner: "user1",
      participants: ["user1", "user2", "user3"],
    },
    {
      id: "room2",
      name: "ロック部屋",
      isPublic: true,
      genre: "ロック",
      maxParticipants: 8,
      createdAt: new Date(Date.now() - 3600000),
      owner: "user4",
      participants: ["user4", "user5"],
    },
    {
      id: "room3",
      name: "クラシック部屋",
      isPublic: true,
      genre: "クラシック",
      maxParticipants: 5,
      createdAt: new Date(Date.now() - 7200000),
      owner: "user6",
      participants: ["user6"],
    },
    {
      id: "room4",
      name: "ジャズ部屋",
      isPublic: true,
      genre: "ジャズ",
      maxParticipants: 6,
      createdAt: new Date(Date.now() - 1800000),
      owner: "user7",
      participants: ["user7", "user8", "user9", "user10"],
    },
    {
      id: "room5",
      name: "EDM部屋",
      isPublic: true,
      genre: "EDM",
      maxParticipants: 15,
      createdAt: new Date(),
      owner: "user11",
      participants: ["user11", "user12"],
    },
    {
      id: "room6",
      name: "アニソン部屋",
      isPublic: true,
      genre: "アニメ",
      maxParticipants: 12,
      createdAt: new Date(Date.now() - 5400000),
      owner: "user13",
      participants: ["user13", "user14", "user15", "user16", "user17"],
    },
    {
      id: "room7",
      name: "K-POP部屋",
      isPublic: true,
      genre: "K-POP",
      maxParticipants: 10,
      createdAt: new Date(Date.now() - 9000000),
      owner: "user18",
      participants: ["user18", "user19", "user20"],
    },
    {
      id: "room8",
      name: "ヒップホップ部屋",
      isPublic: true,
      genre: "ヒップホップ",
      maxParticipants: 8,
      createdAt: new Date(Date.now() - 10800000),
      owner: "user21",
      participants: ["user21", "user22", "user23", "user24"],
    },
  ]);

  const getRooms = (引数) => {
    // api叩く
    apiResult = 
    setRooms(apiResult);
  }

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

const useRoomsState = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomState must be used within a RoomProvider");
  }
  return context;
};

export { RoomsProvider, useRoomsState };
