import { useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner"
import { FlagTriangleLeft } from "lucide-react";



const signUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGeneder] = useState('');
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true)
      
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
        toast.success("User Registered Successfully")
      }

    } catch (error: any) {
      console.log(error.message);
      toast.error("Unable to Register")
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <h2> Register Yourself </h2>
      </div>
      <form onSubmit={submitHandler}>
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
        Male<Input
          type="radio"
          name="gender"
          value='male'
          onChange={(e) => setGeneder(e.target.value)}
        />
        Female<Input
          type="radio"
          name="gender"
          value='female'
          onChange={(e) => setGeneder(e.target.value)}
        />
        Other<Input
          type="radio"
          name="gender"
          value='other'
          onChange={(e) => setGeneder(e.target.value)}
        />
        <Button type='submit'>Sign Up</Button>
        <span className='text-center'>Already have an account? <Link to="/signin" className='text-blue-600'>Login</Link></span>
      </form>
    </div>
  )
}

export default signUp
