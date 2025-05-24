import { Route, HashRouter as Router, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import LandingPage from "./pages/LandingPage"
import Layout from "./pages/Layout"
import AlertProvider from "./components/Alert/AlertProvider"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <>
      <Router>
        <AlertProvider>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="dashboard" element={<Dashboard/>}/>
            </Route>
          </Routes>
        </AlertProvider>
      </Router>
    </>
  )
}

export default App
