import axios from 'axios';

// APIのベースURL
const API_BASE_URL = process.env.API_BASE_URL;

// ルームを作成する関数
export const createRoom = async (roomName, isPublic, genre, maxParticipants, hostUserId) => {
  try {
    const response = await axios.post(`${apiBaseURL}/rooms/create`, {
      room_name: roomName,
      is_public: isPublic,
      genre: genre,
      max_participants: maxParticipants,
      host_user_id: hostUserId,
    });
    return response.data; // サーバーから返されるデータ
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// ルームに参加する関数
export const joinRoom = async (userId, roomId) => {
  try {
    const response = await axios.post(`${apiBaseURL}/rooms/join`, {
      user_id: userId,
      room_id: roomId,
    });
    return response.data; // サーバーから返されるデータ
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

// ルームから退出する関数
export const leaveRoom = async (userId, roomId) => {
  try {
    const response = await axios.post(`${apiBaseURL}/rooms/leave`, {
      user_id: userId,
      room_id: roomId,
    });
    return response.data; // 退出処理は返さないが、成功時のレスポンスを返します
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
};

// ルームを削除する関数
export const deleteRoom = async (roomId) => {
  try {
    const response = await axios.post(`${apiBaseURL}/rooms/delete`, {
      room_id: roomId,
    });
    return response.data; // ルーム削除処理の結果
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// 次のプレイリストに変更する関数
export const setNextPlaylist = async (roomId, playlistId) => {
  try {
    const response = await axios.post(`${apiBaseURL}/rooms/next-playlist`, {
      room_id: roomId,
      playlist_id: playlistId,
    });
    return response.data; // 次のプレイリスト設定処理の結果
  } catch (error) {
    console.error('Error setting next playlist:', error);
    throw error;
  }
};
