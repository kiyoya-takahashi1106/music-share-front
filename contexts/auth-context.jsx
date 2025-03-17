"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

// 初期状態
const initialAuthState = {
  isLogin: false,
  userId: null,
  userName: null,
  userIcon: null,
};

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialAuthState);
  const router = useRouter();

  // サインアップ
  const SignUpFunction = (signUpInfo) => {
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      console.log("パスワードが一致しません");
      return false;
    }

    // APIを叩いて登録処理（仮で成功とする）
    const dbResult = true;

    if (dbResult) {
      setAuthState({
        isLogin: true,
        userId: signUpInfo.userId,
        userName: signUpInfo.userName,
        userIcon: signUpInfo.userIcon,
      });
      router.push("/dash-board");
      console.log("サインアップしました");
      return true;
    } else {
      console.log("サインアップに失敗しました");
      return false;
    }
  };


  // ログイン
  const loginFunction = (loginInfo) => {
    // APIを叩いて認証処理（仮で成功とする）
    const dbResult = true;

    if (dbResult) {
      setAuthState({
        isLogin: true,
        userId: loginInfo.userId,
        userName: loginInfo.userName,
        userIcon: loginInfo.userIcon,
      });
      router.push("/dash-board");
      console.log("ログインしました");
      return true;
    } else {
      console.log("ログインに失敗しました");
      return false;
    }
  };
  

  // ログアウト
  const logoutFunction = () => {
    setAuthState(initialAuthState);
    router.push("/lp");
    console.log("ログアウトしました");
  };

  return (
    <AuthContext.Provider value={{ authState, SignUpFunction, loginFunction, logoutFunction }}>
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
