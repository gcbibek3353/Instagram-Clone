import axios from 'axios';
import { UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SuggestedUsers = ({ userId }: { userId: string }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/user/suggesteduser', {
          withCredentials: true,
        });
        if (res.data.success) {
          // console.log(res.data);
          setSuggestedUsers(res.data.suggestedUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSuggestedUsers();
  }, []);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 font-semibold">Suggested for you</p>
        <span className="text-blue-500 text-sm cursor-pointer hover:underline">See All</span>
      </div>
      <div className="space-y-4">
  {suggestedUsers.map((suggestedUser: any, index: any) => (
    <div key={index} className="flex items-start justify-between mr-3">
      <Link to={`/profile/${suggestedUser._id}`} className="flex items-start space-x-3">
        {
          suggestedUser.profilePic_Url 
          ? ( <img src={suggestedUser.profilePic_Url} alt={`${suggestedUser.profilePic_Url}'s profile`} className="h-10 w-10 rounded-full mr-3" />) 
          : <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />

        }
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{suggestedUser.userName}</span>
          <p className="text-xs text-gray-500">{suggestedUser.bio ? suggestedUser.bio : 'bio here...'}</p>
        </div>
      </Link>
      <button className="text-blue-500 text-xs font-semibold hover:text-blue-600">Follow</button>
    </div>
  ))}
</div>

    </div>
  );
};

export default SuggestedUsers;
