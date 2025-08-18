import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
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
import { useContext} from "react"
import SettingsPage from "./pages/SettingsPage"
import { themeContext } from "./components/Providers/ThemeProvider"
import Help from "./pages/Help"
import HabitStudioPage from "./pages/HabitStudioPage"
import Thankyou from "./pages/Thankyou"
import Terms from "./pages/Terms"
import Refund from "./pages/Refund"
import Privacy from "./pages/Privacy"

function App() {
  const {dark, setDark} = useContext(themeContext)


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
              <Route path="help" element={<Help/>}/>
              <Route path="studio" element={<HabitStudioPage/>}/>
              <Route path="thanks" element={<Thankyou/>}/>
              <Route path="terms" element={<Terms/>}/>
              <Route path="refund" element={<Refund/>}/>
              <Route path="priv" element={<Privacy/>}/>
            </Route>
          </Routes>
          
        </UserProvider>
        </AuthProvider>
        </AlertProvider>
        </SettingsProvider>
      </Router>
      <button
      className="fixed z-50 bottom-3 right-3 bg-panel1 dark:bg-panel1 p-1 px-2 rounded-lg hover:cursor-pointer outline-1 dark:outline-border"
        onClick={() => {
          setDark(!dark)
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  )
}

export default App
