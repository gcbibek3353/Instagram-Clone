import axios from 'axios';
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
    <div>
      {profile?.user?.userName ? (
        <Link to={`/profile/${userId}`}  className='flex gap-2'>
          <img src={profile.user.profilePic_Url} alt={"user_Pic"} className='w-10 h-10 rounded-full' />
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
