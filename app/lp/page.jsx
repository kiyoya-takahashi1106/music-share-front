"use client";

import Header from "@/components/header"
import PublicRooms from "@/components/publicRooms"
// import { useRouter } from "next/navigation";

const Page = () => {
  // const router = useRouter();

  return (
    <div>
      <Header />
      <main style={mainStyle}>
        <h1 style={titleStyle}>Spotify共有ルームへようこそ</h1>
        <p style={descriptionStyle}>友達と音楽を共有しましょう！</p>
        <PublicRooms />
      </main>
    </div>
  )
}

const mainStyle = {
  maxWidth: "800px",
  margin: "2rem auto",
  padding: "0 1rem",
}

const titleStyle = {
  color: "#1DB954",
  fontSize: "2rem",
  marginBottom: "1rem",
}

const descriptionStyle = {
  color: "#333",
  fontSize: "1rem",
}

export default Page 











