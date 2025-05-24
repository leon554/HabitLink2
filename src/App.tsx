import { Route, HashRouter as Router, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import LandingPage from "./pages/LandingPage"
import Layout from "./pages/Layout"

function App() {

  return (
      <Router>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/" element={<LandingPage/>}/>
          </Route>
        </Routes>
      </Router>
  )
}

export default App
