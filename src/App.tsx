import { Route, HashRouter as Router, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import LandingPage from "./pages/LandingPage"
import Layout from "./pages/Layout"
import AlertProvider from "./components/Alert/AlertProvider"
import Dashboard from "./pages/Dashboard"
import AuthProvider from "./components/Session/AuthProvider"
import LogPage from "./pages/LogPage"
import CreatePage from "./pages/CreatePage"

function App() {

  return (
    <>
      <Router>
        <AlertProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="log" element={<LogPage/>}/>
              <Route path="create" element={<CreatePage/>}/>
            </Route>
          </Routes>
        </AuthProvider>
        </AlertProvider>
      </Router>
    </>
  )
}

export default App
