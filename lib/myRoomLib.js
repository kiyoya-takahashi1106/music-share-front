import axios from 'axios';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ルームの詳細を取得する関数
export const getRoomDetail = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
};

// ルームを作成する関数
export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/room/create`, roomData);
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// ルームに参加する関数
export const joinRoom =  (roomId, userId, userName) => {
  try {
    axios.post(`${API_BASE_URL}/room/join`, {
      roomId: roomId,
      roomPassword: null,
      userId: userId,
      userName: userName,
    }, {withCredentials: true,});
    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    return false;
  }
};

// ルームから退出する関数
export const leaveRoom = async (roomId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/room/leave`, {
      roomId: roomId,
      userId: userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
};

// ルームを削除する関数
export const deleteRoom = async (roomId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/room/delete/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// ルームに次の曲を設定する関数（例）
export const setNextSong = async (roomId, songData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/room/${roomId}/next-song`, songData);
    return response.data;
  } catch (error) {
    console.error('Error setting next song:', error);
    throw error;
  }
};

// 次のプレイリストに変更する関数
export const setNextPlaylist = async (roomId, playingPlaylistName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/room/next-playlist`, {
      roomId: roomId,
      playingPlaylistName: playingPlaylistName,
    });
    return response.data;
  } catch (error) {
    console.error('Error setting next playlist:', error);
    throw error;
  }
};
