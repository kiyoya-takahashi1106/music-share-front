import axios from 'axios';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// サービスの連携を追加
export const addServiceApi = async (serviceName, accessToken, refreshToken, expiresAt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/service/add-service`, {
      service_name: serviceName,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("サービス追加エラー:", error);
    return null;
  }
};

// アクセストークンをリフレッシュ
export const refreshTokenApi = async (serviceName, refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/service/refresh-token`, {
      service_name: serviceName,
      refresh_token: refreshToken,
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("アクセストークンのリフレッシュエラー:", error);
    return null;
  }
};

// サービス情報を取得
export const getServiceInfoApi = async (serviceName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service/get-service-info`, {
      params: {
        service_name: serviceName,
      },
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("サービス情報取得エラー:", error);
    return null;
  }
};

// サービスの削除
export const removeServiceApi = async (serviceName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/service/remove-service`, {
      data: {
        service_name: serviceName,
      },
    });
    return response.data; // サーバーからのレスポンスを返す
  } catch (error) {
    console.error("サービス削除エラー:", error);
    return null;
  }
};
