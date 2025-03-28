import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 既存の関数群…

// Spotifyの認証コードをバックエンドへ送信して、連携処理を実行する関数
export const connectSpotifyApi = async (code) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/spotify/callback`,
      { code },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in connectSpotifyApi:", error);
    throw error;
  }
};