"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
// 修正: login ではなく loginApi、他も同様に名前を合わせる
import { signUpApi, loginApi, logoutApi } from "../lib/authLib";

const initialAuthState = {
  isLogin: false,
  userId: null,
  userName: null,
  userIcon: null,
  is_verified: false,
  services: [],
};

// const initialAuthState = {
//   isLogin: true,
//   userId: 2,
//   userName: "test2",
//   userIcon: null,
//   isVerified: false,
//   services: [],
// };

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
      const response = await signUpApi(signUpInfo);
      if (response) {
        setAuthState({
          isLogin: true,
          userId: response.user_id,
          userName: response.user_name,
          userIcon: response.profile_image_url,
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
      router.push("/lp");
      console.log("ログアウトしました");
    } catch (error) {
      console.log("ログアウトに失敗しました", error);
    }
  };

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
