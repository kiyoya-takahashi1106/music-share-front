"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { signUp, login, logout } from "../lib/authLib";

// 初期状態
const initialAuthState = {
  isLogin: false,
  userId: null,
  userName: null,
  userIcon: null,
  is_verified: false, // 認証状態を追加
  services: [], // 認証サービスの情報を配列で保持
};

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialAuthState);
  const router = useRouter();

  // サインアップ
  const SignUpFunction = async (signUpInfo) => {
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      console.log("パスワードが一致しません");
      return false;
    }

    try {
      const response = await signUp(signUpInfo);
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
          is_verified: false,
          services: [
          ],
        });
        router.push("/dash-board");
        console.log("サインアップしました");
        return true;
      }
    } catch (error) {
      console.log("サインアップに失敗しました", error);
      return false;
    }
  };

  // ログイン
  const loginFunction = async (loginInfo) => {
    try {
      const response = await login(loginInfo);
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
          is_verified: response.is_verified, // 認証状態を追加
          services: [
          ],
        });
        router.push("/dash-board");
        console.log("ログインしました");
        return true;
      }
    } catch (error) {
      console.log("ログインに失敗しました", error);
      return false;
    }
  };

  // ログアウト
  const logoutFunction = async () => {
    try {
      await logout();
      setAuthState(initialAuthState);
      router.push("/lp");
      console.log("ログアウトしました");
    } catch (error) {
      console.log("ログアウトに失敗しました", error);
    }
  };

  // サービスを追加する関数（例: Spotify以外のサービスの認証情報を追加）
  const addService = (serviceName, accessToken, refreshToken) => {
    setAuthState((prevState) => ({
      ...prevState,
      services: [
        ...prevState.services,
        {
          name: serviceName,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      ],
    }));
  };

  return (
    <AuthContext.Provider value={{ authState, SignUpFunction, loginFunction, logoutFunction, addService }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthState };
