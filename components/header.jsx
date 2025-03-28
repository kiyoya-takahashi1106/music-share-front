"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuthState } from "@/contexts/authContext"
import { User, Music, X } from "lucide-react"
import UserMenuModal from "./modal/user-menu"

const Header = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { authState, getUserInfo } = useAuthState()
  const isLogin = authState.isLogin

  useEffect(() => {
    // リロードされてもログイン情報を保持
    const fetchUserInfo = async () => {
      await getUserInfo()
      setIsLoading(false)
    }
    fetchUserInfo()

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div> // ローディング中の表示
  }

  // css
  const headerStyle = {
    backgroundColor: "#1DB954",
    padding: "1rem",
    color: "#FFFFFF",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const titleStyle = {
    margin: isMobile ? "0 0 1rem 0" : 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
  }

  const navStyle = {
    width: isMobile ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
  }

  const ulStyle = {
    listStyle: "none",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "1rem",
    margin: 0,
    padding: 0,
  }

  const linkStyle = {
    color: "#FFFFFF",
    textDecoration: "none",
  }

  const buttonStyle = (isPrimary) => ({
    color: isPrimary ? "#1DB954" : "#FFFFFF",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    backgroundColor: isPrimary ? "#FFFFFF" : "transparent",
    border: isPrimary ? "none" : "2px solid #FFFFFF",
    borderRadius: "20px",
    transition: "all 0.3s",
    fontWeight: "bold",
    display: "inline-block",
    width: isMobile ? "100%" : "auto",
    textAlign: "center",
    boxSizing: "border-box",
    cursor: "pointer",
  })

  const userIconStyle = {
    marginLeft: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={containerStyle}>
          <h1 style={titleStyle}>
            {isLogin ? (
              <Link href="/dash-board" style={linkStyle}>
                Spotify共有ルーム
              </Link>
            ) : (
              <Link href="/" style={linkStyle}>
                Spotify共有ルーム
              </Link>
            )}
          </h1>
          <nav style={navStyle}>
            {isLogin ? (
              // ログインしている場合
              <ul style={ulStyle}>
                <li style={{ width: isMobile ? "100%" : "auto" }}>
                  <Link href="/create-room" style={buttonStyle(false)}>
                    ルーム作成
                  </Link>
                </li>
              </ul>
            ) : (
              // ログインしていない場合
              <ul style={ulStyle}>
                <li style={{ width: isMobile ? "100%" : "auto" }}>
                  <Link href="/auth/sign-up" style={buttonStyle(true)}>
                    サインアップ
                  </Link>
                </li>
                <li style={{ width: isMobile ? "100%" : "auto" }}>
                  <Link href="/auth/sign-in" style={buttonStyle(false)}>
                    ログイン
                  </Link>
                </li>
              </ul>
            )}

            {/* loginしてる時のみuser icon表示 */}
            {isLogin && (
              <div style={userIconStyle} onClick={() => setIsMenuOpen(true)}>
                <User size={24} color="#FFFFFF" />
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Spotify連携バナー - ログイン済みかつSpotify連携がまだの場合に表示 */}
      {isLogin && authState.isSpotify === false && <SpotifyBanner />}

      {/* ユーザーメニューモーダル */}
      <UserMenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

// Spotify連携バナーコンポーネント
const SpotifyBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  // インラインスタイルを使用して、より適切なレイアウトを実現
  const bannerStyle = {
    backgroundColor: "#121212",
    color: "#FFFFFF",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
  }

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const buttonStyle = {
    backgroundColor: "#1DB954",
    color: "#000000",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "medium",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  }

  const closeButtonStyle = {
    background: "none",
    border: "none",
    padding: "4px",
    cursor: "pointer",
    color: "#A7A7A7",
  }

  return (
    <div style={bannerStyle}>
      <div style={leftSectionStyle}>
        <Music color="#1DB954" size={18} style={{ marginRight: "8px" }} />
        <span style={{ fontSize: "14px" }}>Spotifyと連携しましょう！</span>
      </div>
      <div style={rightSectionStyle}>
        <Link href="/spotify-connect" style={{ textDecoration: "none" }}>
          <button
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1ED760")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1DB954")}
          >
            連携する
          </button>
        </Link>
        <button
          style={closeButtonStyle}
          onClick={() => setIsDismissed(true)}
          onMouseOver={(e) => (e.target.style.color = "#FFFFFF")}
          onMouseOut={(e) => (e.target.style.color = "#A7A7A7")}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Header

