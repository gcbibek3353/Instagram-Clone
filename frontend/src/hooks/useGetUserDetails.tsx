import axios from "axios";
import { useEffect } from "react"


const getUserProfile = (userId : string) =>{

    useEffect(()=>{
        const fetchUser = async()=>{
            const res = await axios.get(`http://localhost:3000/api/v1/user/profile/${userId}`,{withCredentials : true });
            if(res.data.success){
                // add res.data.user in reciol atom
            }
        }

    },[userId]);

}

export default getUserProfile