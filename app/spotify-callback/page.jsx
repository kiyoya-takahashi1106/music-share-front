"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthState } from "@/contexts/authContext";

export default function SpotifyCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { connectSpotify } = useAuthState();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      (async () => {
        try {
          await connectSpotify(code);
          router.push("/dash-board");
        } catch (error) {
          console.error("Spotify連携エラー:", error);
          router.push("/spotify-connect");
        }
      })();
    } else {
      console.error("URLに認証コードが見つかりません");
      router.push("/spotify-connect");
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <p>Spotifyと連携中です...</p>
    </div>
  );
}