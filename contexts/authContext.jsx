"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getUserInfoApi, signUpApi, loginApi, updateApi, logoutApi } from "../lib/authLib";
import { connectSpotifyApi } from "../lib/musicServiceLib";

const initialAuthState = {
  isLogin: false,
  userId: null,
  userName: null,
  email: null,
  userIcon: null,
  isSpotify: false,
  services: {
    spotify: {
      serviceUserId: null,
      encryptedAccessToken: null,
      expiresAt: null,
    },
  },
};

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialAuthState);
  const router = useRouter();
  
  // cookieからユーザー情報を取得
  const getUserInfo = async () => {
    try {
      const response = await getUserInfoApi();
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.userId,
          userName: response.userName,
          userIcon: response.profileImageUrl,
          email: response.email,
          isSpotify: response.isSpotify,
          services: response.services || {},
        });
      }
    } catch (error) {
      router.push("/auth/sign-in");
      console.log("ユーザー情報の取得に失敗しました", error);
    }
  };

  // サインアップ
  const SignUpFunction = async (signUpInfo) => {
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      console.log("パスワードが一致しません");
      return false;
    }
    try {
      const response = await signUpApi(signUpInfo);
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.userId,
          userName: response.userName,
          userIcon: response.profileImageUrl,
          email: response.email,
          isSpotify: response.isSpotify,
          services: response.services || {},
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
      const response = await loginApi(loginInfo);
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.userId,
          userName: response.userName,
          userIcon: response.profileImageUrl,
          email: response.email,
          isSpotify: response.isSpotify,
          services: response.services || {},
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
      await logoutApi();
      setAuthState(initialAuthState);
      router.push("/auth/sign-in");
      console.log("ログアウトしました");
    } catch (error) {
      console.log("ログアウトに失敗しました", error);
    }
  };

  // プロフィール更新
  const updateProfile = async (profileData) => {
    console.log("updateProfile", profileData);
    try {
      await updateApi( authState.userId, profileData.name, profileData.email );
      setAuthState((prevState) => ({
        ...prevState,
        userName: profileData.userName,
        email: profileData.email,
      }));
      return true;
    } catch (error) {
      console.log("プロフィール更新に失敗しました", error);
      return false;
    }
  };

  // Spotify連携処理: 認証コードをバックエンドへ送信
  const connectSpotify = async (code) => {
    try {
      const response = await connectSpotifyApi(authState.userId, code);
      if (response.status==="success") {
        // 連携成功なら authState の isSpotify を true に更新
        setAuthState((prevState) => ({ ...prevState, isSpotify: true }));
        console.log("Spotify連携に成功しました");
        return true;
      } else {
        throw new Error("Spotify連携に失敗しました");
      }
    } catch (error) {
      console.error("Failed to connect Spotify:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ authState, getUserInfo, SignUpFunction, loginFunction, updateProfile, logoutFunction, connectSpotify }}
    >
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