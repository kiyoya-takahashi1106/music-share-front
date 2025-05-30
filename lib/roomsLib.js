import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 公開ルームの一覧を取得する関数
export const getPublicRooms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms/public`, {
      withCredentials: true,
    });
    return response.data; // サーバーはキャメルケースのキーで返す前提
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    throw error;
  }
};

// // ルーム検索を行う関数
// export const searchRooms = async (searchQuery) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/rooms/search`, {
//       params: { search_query: searchQuery },
//     });
//     return response.data; // サーバーはキャメルケースのキーで返す前提
//   } catch (error) {
//     console.error('Error searching rooms:', error);
//     throw error;
//   }
// };
