import axios from 'axios';
import CryptoJS from "crypto-js";

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// パスワードをハッシュ化する関数
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64); // Base64エンコードで返す
};

// ユーザー情報を取得するAPIリクエスト
export const getUserInfoApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user-info`, {
      withCredentials: true,
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return null;
  }
};


// サインアップ用のAPIリクエスト
export const signUpApi = async (signUpInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/sign-up`, {
      user_name: signUpInfo.userName,
      email: signUpInfo.email,
      password: signUpInfo.password,
      profile_image_url: signUpInfo.profileImageUrl,
    }, {withCredentials: true});
    return response.data; // サーバーからのレスポンスを返す
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
      password: loginInfo.password,
    }, {withCredentials: true});
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("ログインエラー:", error);
    return null;
  }
};


// ログアウト用のAPIリクエスト（トークンの削除など）
export const logoutApi = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/auth/sign-out`, {withCredentials: true});
  } catch (error) {
    console.error("ログアウトエラーやで：", error);
  }
};



// プロフィール更新用のAPIリクエスト
export const updateApi = async (profileData) => {
  try {
    await axios.put(`${API_BASE_URL}/auth/update-profile`, {
      user_id: profileData.userId,
      user_name: profileData.userName,
      email: profileData.email,
    });
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
  }
}


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
