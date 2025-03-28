import axios from 'axios';
import CryptoJS from "crypto-js";

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// パスワードをハッシュ化する関数
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
};

// ユーザー情報を取得するAPIリクエスト
export const getUserInfoApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user-info`, {
      withCredentials: true,
    });
    // サーバーはキャメルケースのキーで返す前提 (userId, userName, email, role, isSpotify, services)
    return response.data;
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return null;
  }
};


// サインアップ用のAPIリクエスト
export const signUpApi = async (signUpInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/sign-up`, {
      // フロントから送信する値はキャメルケース（userName, email, hashPassword）
      userName: signUpInfo.userName,
      email: signUpInfo.email,
      hashPassword: hashPassword(signUpInfo.password),
    }, { withCredentials: true });
    // サーバーからはキャメルケース (userId, userName, email, role, isSpotify, services) で返す
    return response.data;
  } catch (error) {
    console.error("サインアップエラー:", error);
    return null;
  }
};


// ログイン用のAPIリクエスト
export const loginApi = async (loginInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/sign-in`, {
      email: loginInfo.email,
      hashPassword: hashPassword(loginInfo.password),
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    console.error("ログインエラー:", error);
    return null;
  }
};


// ログアウト用のAPIリクエスト（トークンの削除など）
export const logoutApi = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/sign-out`, {}, { withCredentials: true });
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};


// プロフィール更新用のAPIリクエスト
export const updateApi = async (profileData) => {
  try {
    await axios.put(`${API_BASE_URL}/auth/update-profile`, {
      userId: profileData.userId,
      userName: profileData.userName,
      email: profileData.email,
    }, { withCredentials: true });
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
  }
};
