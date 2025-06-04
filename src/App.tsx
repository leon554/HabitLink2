import { Route, HashRouter as Router, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import LandingPage from "./pages/LandingPage"
import Layout from "./pages/Layout"
import AlertProvider from "./components/Alert/AlertProvider"
import Dashboard from "./pages/Dashboard"
import AuthProvider from "./components/Session/AuthProvider"
import LogPage from "./pages/LogPage"
import CreatePage from "./pages/CreatePage"
import UserProvider from "./components/UserProvider"
import HabitInputProvider from "./components/InputBox/HabitInputProvider"
import StatsPage from "./pages/StatsPage"

function App() {

  return (
    <>
      <Router>
        <AlertProvider>
        <AuthProvider>
        <UserProvider>
        <HabitInputProvider>

          <Routes>
            <Route element={<Layout/>}>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="log" element={<LogPage/>}/>
              <Route path="create" element={<CreatePage/>}/>
              <Route path="stats" element={<StatsPage/>}/>
            </Route>
          </Routes>
          
        </HabitInputProvider>
        </UserProvider>
        </AuthProvider>
        </AlertProvider>
      </Router>
    </>
  )
}

export default App
