import axios from 'axios';
import { UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SuggestedUsers = ({ userId }: { userId: string }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/user/suggesteduser', {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res.data);
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
                  ? (<img src={suggestedUser.profilePic_Url} alt={`${suggestedUser.profilePic_Url}'s profile`} className="h-10 w-10 rounded-full mr-3" />)
                  : <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />

              }
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">{suggestedUser.userName}</span>
                <p className="text-xs text-gray-500">{suggestedUser.bio ? suggestedUser.bio : 'bio here...'}</p>
              </div>
            </Link>

            <FollowUnfollow id={suggestedUser._id} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default SuggestedUsers;


const FollowUnfollow = ({id} : {id:string}) => {
  const [isfollowing, setIsFollowing] = useState(true);

  const followHandler = async (userTofollow: string) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/user/followorunfollow/${userTofollow}`, {}, {
        withCredentials: true
      });
      if (res.data.action == 'follow') {
        setIsFollowing(true);
        toast.success('followed successfully')
      }
      else if (res.data.action == 'unfollow') {
        toast.success('unfollowed successfully')
        setIsFollowing(false);
      }
      console.log(res);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    followHandler(id);
  }, [])

  return <button
    className="text-blue-500 text-xs font-semibold hover:text-blue-600"
    onClick={() => followHandler(id)}
  >
    {isfollowing ? 'Unfollow' : 'follow'}
  </button>
}