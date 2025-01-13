import { useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner"
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/recoil/user";


const signIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const setUser = useSetRecoilState(userAtom);

  const submitHandler = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      setLoading(true)
      
      const res = await axios.post('http://localhost:3000/api/v1/user/login', { email, password}, {
        headers: {
          'Content-Type': 'application/json'
        },
         withCredentials: true
      });
      if (res.data.success) {
        setEmail('')
        setPassword('')
        setUser(res.data.user);
    
        navigate("/");
        toast.success("Logged In Successfully");
        setLoading(false);
      }

    } catch (error: any) {
      console.log(error.message);
      toast.error("Unable to Login")
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-5 ">
      <div className="p-5 border-2 ">
      <div>
        <h2 className="font-bold text-2xl text-center m-4"> Login </h2>
      </div>
      <form className="flex flex-col gap-4 items-center " onSubmit={submitHandler}>
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
        <Button type='submit' disabled={loading}>{loading ? "Logging In ...": "Login"}</Button>
        <span className='text-center'>Do not have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Sign Up</Link></span>
      </form>
      </div>
    </div>
   
  )
}

export default signIn
