import {useState,useEffect} from 'react'
import axios from 'axios'

const useAuth = ()=>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    console.log(`control here`);
    
    useEffect(() => {
      const verifyToken = async () => {
        try {
            // console.log('hereeeeeeeeeeee');
             await axios.get('http://localhost:3000/api/v1/user/auth', { withCredentials: true }).then((res)=>{
              if (res.data.authenticated) {
                console.log("true set")
                setIsAuthenticated(true);
              }
              console.log(res,"resfnasksdn i")
            })
            // console.log(response);
           
          } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
          }
        };
        
        verifyToken();
      }, []);
      

      return isAuthenticated;
}
export default useAuth;