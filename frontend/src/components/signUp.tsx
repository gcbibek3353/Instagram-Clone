import { useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner"

const signUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGeneder] = useState('');
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/register', { userName, email, password, gender }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        setUserName('')
        setEmail('')
        setPassword('')
        navigate("/signin");
        setLoading(false)
        toast.success("User Registered Successfully")
      }

    } catch (error: any) {
      console.log(error.message);
      toast.error("Unable to Register")
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-5 ">
      <div className="p-5 border-2">
        <div>
          <h2 className="font-bold text-2xl text-center m-4"> Register Yourself </h2>
        </div>
        <form className="flex flex-col gap-4 items-center " onSubmit={submitHandler}>
          <Input
            type="text"
            name="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="focus-visible:ring-transparent my-2"
            placeholder="userName"
          />
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-visible:ring-transparent my-2"
            placeholder="Email"
          />
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-visible:ring-transparent my-2"
            placeholder="******"
          />
         <div className="flex flex-col gap-4 p-4 rounded-md w-full max-w-sm mx-auto">
  <div className="flex items-center gap-4">
    <label htmlFor="male" className="flex items-center gap-2 cursor-pointer">
      <span className="text-gray-700 font-medium">Male</span>
      <input
        id="male"
        type="radio"
        name="gender"
        value="male"
        className="accent-blue-500 focus:ring focus:ring-blue-300"
        onChange={(e) => setGeneder(e.target.value)}
      />
    </label>
  </div>
  <div className="flex items-center gap-4">
    <label htmlFor="female" className="flex items-center gap-2 cursor-pointer">
      <span className="text-gray-700 font-medium">Female</span>
      <input
        id="female"
        type="radio"
        name="gender"
        value="female"
        className="accent-blue-500 focus:ring focus:ring-blue-300"
        onChange={(e) => setGeneder(e.target.value)}
      />
    </label>
  </div>
  <div className="flex items-center gap-4">
    <label htmlFor="other" className="flex items-center gap-2 cursor-pointer">
      <span className="text-gray-700 font-medium">Other</span>
      <input
        id="other"
        type="radio"
        name="gender"
        value="other"
        className="accent-blue-500 focus:ring focus:ring-blue-300"
        onChange={(e) => setGeneder(e.target.value)}
      />
    </label>
  </div>
</div>

          <Button type='submit'>{loading ?"Signing Up...":"Sign Up"}</Button>
          <span className='text-center'>Already have an account? <Link to="/signin" className='text-blue-600 hover:underline'>Login</Link></span>
        </form>
      </div>
    </div>
  )
}

export default signUp
