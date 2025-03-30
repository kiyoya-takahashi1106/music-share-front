import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Spotifyの認証コードをバックエンドへ送信して、連携処理を実行する関数
export const connectSpotifyApi = async (userId, code) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/spotify/connect`,{
        userId : userId,
        code: code 
      }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error in connectSpotifyApi:", error);
    throw error;
  }
};

export const disconnectSpotifyApi = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/spotify/disconnect`, {
        data: {userId : userId}
      }, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in disconnectSpotifyApi:", error);
    throw error;
  }
};