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
    e.preventDefault();
    try {
      setLoading(true)
      
      const res = await axios.post('http://localhost:3000/api/v1/user/login', { email, password}, {
        headers: {
          'Content-Type': 'application/json'
        },
         withCredentials: true
      });
      // console.log(res.data);
      if (res.data.success) {
        setEmail('')
        setPassword('')
        console.log(res.data);
        setUser(res.data.user);
    
        navigate("/");
        toast.success("Logged In Successfully")
      }

    } catch (error: any) {
      console.log(error.message);
      toast.error("Unable to Login")
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <h2> Login </h2>
      </div>
      <form onSubmit={submitHandler}>
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
        <Button type='submit'>Login</Button>
        <span className='text-center'>Do not have an account? <Link to="/signup" className='text-blue-600'>Sign Up</Link></span>
      </form>
    </div>
  )
}

export default signIn
