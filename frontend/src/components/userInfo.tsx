import axios from 'axios';
import { UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const userInfo = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await axios.get(`http://localhost:3000/api/v1/user/profile/${userId}`, {
          withCredentials: true
        });
        // console.log(userProfile.data);
        setProfile(userProfile.data);
      } catch (error) {
        console.log(error);
        return;
      }
    }
    fetchProfile();
  }, [userId])

  return (
    <div className='p-2 m-3'>
      {profile?.user?.userName ? (
        <Link to={`/profile/${userId}`}  className='flex gap-2'>
          {
            profile.user.profilePic_Url ?
             <img src={profile.user.profilePic_Url} alt={"user_Pic"} className='w-10 h-10 rounded-full' />
             :  <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />
          }
          
          <div>
            <p>{profile.user.userName}</p>
            <p>{profile.user.bio}</p>
          </div>
        </Link >
      ) : (
        <p>Loading userInfo...</p>
      )}
    </div>
  )
}

export default userInfo
