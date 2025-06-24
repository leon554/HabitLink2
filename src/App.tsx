import { Route, HashRouter as Router, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import LandingPage from "./pages/LandingPage"
import Layout from "./pages/Layout"
import AlertProvider from "./components/Alert/AlertProvider"
import Dashboard from "./pages/Dashboard"
import AuthProvider from "./components/Providers/AuthProvider"
import LogPage from "./pages/LogPage"
import CreatePage from "./pages/CreatePage"
import UserProvider from "./components/Providers/UserProvider"
import StatsPage from "./pages/StatsPage"
import SettingsProvider from "./components/Providers/SettingsProvider"
import GoalsPage from "./pages/GoalsPage"
import CreateGaolPage from "./pages/CreateGaolPage"
import { useState, useEffect, useLayoutEffect} from "react"
import SettingsPage from "./pages/SettingsPage"

function App() {
  const [dark, setDark] = useState<boolean|null>(null)

  useLayoutEffect(() => {

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if(savedTheme === "light"){
      setDark(false);
      document.documentElement.classList.remove("dark");
    }else{
      setDark(true)
    }
  }, []);

  useEffect(() => {
    if(dark === null) return
    if (dark) {
      document.documentElement.style.backgroundColor = "#1f1f1f"; // Dark background
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.style.backgroundColor = "#ffffff"; // Light background
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light");
    }
    
  }, [dark]);

  return (
    <div className="">
      <Router>
        <SettingsProvider>
        <AlertProvider>
        <AuthProvider>
        <UserProvider>

          <Routes>
            <Route element={<Layout/>}>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="log" element={<LogPage/>}/>
              <Route path="create" element={<CreatePage/>}/>
              <Route path="creategoal" element={<CreateGaolPage/>}/>
              <Route path="stats" element={<StatsPage/>}/>
              <Route path="goals" element={<GoalsPage/>}/>
              <Route path="settings" element={<SettingsPage/>}/>
            </Route>
          </Routes>
          
        </UserProvider>
        </AuthProvider>
        </AlertProvider>
        </SettingsProvider>
      </Router>
      <button
      className="fixed z-50 bottom-3 right-3 bg-panel1 dark:bg-panel1 p-1 px-2 rounded-lg hover:cursor-pointer outline-1 dark:outline-border"
        onClick={() => setDark(!dark)}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  )
}

export default App
