import { Route, Routes } from "react-router-dom"
import SignUp from "./components/signUp"
import SignIn from "./components/signIn"
import CreatePost from "./components/createPost"
import Dashboard from "./components/dashboard"
import Profile from "./components/profile"
import EditProfile from "./components/editProfile"
import MainLayout from "./components/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} >
        <Route index element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/createPost/:id" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      </Route>
      <Route path="/editProfile/:id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

    </Routes>
  )
}

export default App
