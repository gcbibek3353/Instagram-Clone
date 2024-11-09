import { Route, Routes } from "react-router-dom"
import SignUp from "./components/signUp"
import SignIn from "./components/signIn"
import Home from "./components/home"
import createPost from "./components/createPost"
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

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      <Route index element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
        {/* <Route index element={} />
          <Route path="/profile/:id/saved" element={} /> */}
      </Route>
      <Route path="/createPost/:id" element={<ProtectedRoute><createPost /></ProtectedRoute>} />
      <Route path="/editProfile/:id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      {/* <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/editProfile/:id" element={<EditProfile />} /> */}
    </Routes>
  )
}

export default App
