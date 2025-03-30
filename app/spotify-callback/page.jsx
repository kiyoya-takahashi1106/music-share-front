"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthState } from "@/contexts/authContext";

export default function SpotifyCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authState, getUserInfo, connectSpotify } = useAuthState();

  // ① ユーザー情報を取得する
  useEffect(() => {
    if (authState.userId === null) {
      getUserInfo();
    }
  }, []);

  // ② ユーザー情報(authState)が更新された後、Spotify連携を実行する
  useEffect(() => {
    if (authState.userId !== null) {
      const code = searchParams.get("code");
      if (code && authState.userId) {
        (async () => {
          try {
            const result = await connectSpotify(code);
            if (result){
              router.push("/dash-board");
            }
          } catch (error) {
            console.error("Spotify連携エラー:", error);
            // router.push("/spotify-connect");
          }
        })();
      }
    }
  }, [authState.userId]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <p>Spotifyと連携中です...</p>
    </div>
  );  
}