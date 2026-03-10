import { createContext, useState, useEffect } from "react"
import { getCurrentUser, login } from "../api/auth.jsx"

export const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
    const token = localStorage.getItem("token")

    if (token) {
      getCurrentUser()
      .then(data => {
        setUser(data.user)
      })
      .catch(() => {
        localStorage.removeItem("token")
        setUser(null)
      })
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}