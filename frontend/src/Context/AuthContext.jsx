import { useState, useEffect } from "react"
import { getCurrentUser, login } from "../Api/auth.api.js"
import { AuthContext } from "./AuthContextObject"

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(storedToken))

  async function loginUser(username, password) {
    const loginData = await login(username, password)
    localStorage.setItem("token", loginData.token);
    const data = await getCurrentUser()
    setUser(data.user)
    return data.user
  }

  function logoutUser() {
    localStorage.removeItem("token")
    setUser(null)
  }

  useEffect(() => {
    if (!storedToken) return

    getCurrentUser()
      .then(data => {
        setUser(data.user)
      })
      .catch(() => {
        localStorage.removeItem("token")
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [storedToken])

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}