"use client"

import { useState } from "react"

const LoginModal = ({ isOpen, onClose, onSubmit, handleSignUp }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleOpendiffModal = () => {
    onClose()
    handleSignUp()
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 style={styles.title}>ログイン</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            ログイン
          </button>
        </form>
        <div style={styles.linkContainer}>
          <button onClick={handleOpendiffModal} style={styles.signupButton}>
            アカウントをお持ちでない方はこちら
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#666",
  },
  title: {
    color: "#191414",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#191414",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
    color: "#000000",
  },
  button: {
    backgroundColor: "#1DB954",
    color: "#ffffff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
    width: "100%",
  },
  linkContainer: {
    marginTop: "1.5rem",
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: "transparent",
    color: "#1DB954",
    border: "1px solid #1DB954",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    transition: "all 0.3s ease",
  },
}

export default LoginModal