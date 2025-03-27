"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
// 修正: login ではなく loginApi、他も同様に名前を合わせる
import { getUserInfoApi, signUpApi, loginApi, updateApi, logoutApi } from "../lib/authLib";

const initialAuthState = {
  isLogin: false,
  userId: null,
  userName: null,
  email: "null",
  userIcon: null,
  is_verified: false,
  services: [],
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
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
          email: response.email,
          isVerified: false,
          services: [],
        });
      }
    } catch (error) {
      router.push("/auth/sign-in");
      console.log("ユーザー情報の取得に失敗しました", error);
    }
  }


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
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
          email: response.email,
          isVerified: false,
          services: [],
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
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
          email: response.email,
          isVerified: response.is_verified,
          services: [],
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
  const updateProfile = async(profileData) => {
    try{
      updateApi({
        userId: authState.userId,
        userName: profileData.name,
        email: profileData.email,
      });
      setAuthState((prevState) => ({
        ...prevState,
        userName: profileData.name,
        email: profileData.email,
      }));
      return true
    } catch (error) {
      console.log("プロフィール更新に失敗しました", error);
      return false
    }
  }


  // サービス追加
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
    <AuthContext.Provider value={{ authState, getUserInfo, SignUpFunction, loginFunction, updateProfile, logoutFunction, addService }}>
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
