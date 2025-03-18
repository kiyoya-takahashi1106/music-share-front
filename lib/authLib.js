import axios from 'axios';
import CryptoJS from "crypto-js";

// APIのベースURL
const API_BASE_URL = process.env.API_BASE_URL;

// パスワードをハッシュ化する関数
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Base64エンコードで返す
};

// サインアップ用のAPIリクエスト
export const signUpApi = async (signUpInfo) => {
  try {
    const hashedPassword = hashPassword(signUpInfo.password);
    const response = await axios.post(`${API_BASE_URL}/auth/sign-up`, {
      user_name: signUpInfo.userName,
      email: signUpInfo.email,
      hash_password: hashedPassword,
      profile_image_url: signUpInfo.profileImageUrl,
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("サインアップエラー:", error);
    return null;
  }
};

// ログイン用のAPIリクエスト
export const loginApi = async (loginInfo) => {
  try {
    const hashedPassword = hashPassword(loginInfo.password);
    const response = await axios.post(`${API_BASE_URL}/auth/sign-in`, {
      email: loginInfo.email,
      hash_password: hashedPassword,
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("ログインエラー:", error);
    return null;
  }
};

// ログアウト用のAPIリクエスト（トークンの削除など）
export const logoutApi = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/sign-out`);
    return response.data;
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return null;
  }
};

// アカウント削除用のAPIリクエスト
export const deleteAccountApi = async (deleteInfo) => {
  try {
    const hashedPassword = hashPassword(deleteInfo.password);
    const response = await axios.delete(`${API_BASE_URL}/auth/account-delete`, {
      data: {
        user_id: deleteInfo.userId,
        hash_password: hashedPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.error("アカウント削除エラー:", error);
    return null;
  }
};
