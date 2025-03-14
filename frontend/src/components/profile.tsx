import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, UserRound} from 'lucide-react';
// import { useRecoilValue } from 'recoil';
// import { userAtom } from '@/recoil/user';

const profile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState({});
  // const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await axios.get(`http://localhost:3000/api/v1/user/profile/${id}`, {
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
  }, [id])

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return <div className='grid grid-cols-1 place-items-center lg:grid-cols-3 gap-3'>
          {//@ts-ignore
            (profile.user.posts.length > 0) ?
            //@ts-ignore
            profile.user.posts.map((post: any) => {
              return (post.images && post.images.length > 0) ? <div key={post._id}>
                <div className='bg-slate-700 flex items-center justify-center gap-4 text-white w-40 h-40 absolute opacity-0 hover:opacity-80'>
                  <div className='flex gap-2 items-center justify-center transition-opacity'>
                  <span><Heart /> {post.likes.length}</span>
                  <span><MessageCircle /> {post.comments.length}</span>
                  </div>
                </div>
                <img src={post.images[0]} className='w-40 h-40' />
              </div>
                : ""
            }) :
            <div> User have no posts</div>
          }
        </div>
      case 'saved':
        return <div className='grid grid-cols-1 place-items-center lg:grid-cols-3 gap-3'>
          {//@ts-ignore
            (profile.user.posts.length > 0) ?
            //@ts-ignore
            profile.user.bookmarks.map((post: any) => {
              return (post.images && post.images.length > 0) ?<div key={post._id}>
              <div className='bg-slate-700 flex items-center justify-center gap-4 text-white w-40 h-40 absolute opacity-0 hover:opacity-80'>
                <div className='flex gap-2 items-center justify-center transition-opacity'>
                <span><Heart /> {post.likes.length}</span>
                <span><MessageCircle /> {post.comments.length}</span>
                </div>
              </div>
              <img src={post.images[0]} className='w-40 h-40' />
            </div>
                : ""
            }):
            <div> User have no Saved posts</div>
          }
        </div>
      case 'reels':
        return <div className='text-center'>reels</div>
      case 'tags':
        return <div className='text-center'>tags</div>
      default:
        return null
    }
  }

  const activeClass = (activeTab : unknown, currentTab : unknown) => {
    return activeTab == currentTab ?
      'p-2 m-4 bg-slate-400 rounded-md'
      : 'p-2 m-4 bg-slate-300 rounded-md'
  }

  return (
    <div className="flex flex-col items-center gap-10 p-6 lg:flex-row lg:gap-20">
      <div>
        {//@ts-ignore
        profile?.user?.userName ? (
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
              {//@ts-ignore
                profile.user.profilePic_Url 
                ? <img
                src={//@ts-ignore
                  profile.user.profilePic_Url}
                alt="Profile_Pic"
                className="rounded-full w-24 h-24 shadow-md"
              />
              : <UserRound className='"rounded-full w-24 h-24 shadow-md"' />

              }
             
              <div className="flex flex-col items-center lg:items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{//@ts-ignore
                  profile.user.userName}</span>
                  {/* <Link */}
                  <span
                    // className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300"
                    // to={`/editProfile/${id}`}
                  >
                    {/* Edit Profile */}
                    </span>
                  {/* </Link> */}
                  <span 
                  // className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
                  >
                    {/* View Archive */}
                  </span>
                  <span 
                  // className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
                  >
                    {/* Add tools */}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>{//@ts-ignore
                  profile.user.posts.length} posts</span>
                  <span>{//@ts-ignore
                  profile.user.followers.length} followers</span>
                  <span>{//@ts-ignore
                  profile.user.following.length} following</span>
                </div>
                <p className="text-center lg:text-left text-gray-700">{//@ts-ignore
                profile.user.bio}</p>
              </div>
            </div>
  
            <hr className="my-4 border-t border-gray-200 w-full" />
  
            <div className="w-full">
              <ul className="flex lg:justify-around justify-center lg:gap-6 mb-4">
                <button
                  className={`text-sm font-semibold ${
                    activeClass(activeTab, 'posts')
                  }`}
                  onClick={() => setActiveTab('posts')}
                >
                  POSTS
                </button>
                <button
                  className={`text-sm font-semibold ${
                    activeClass(activeTab, 'saved')
                  }`}
                  onClick={() => setActiveTab('saved')}
                >
                  SAVED
                </button>
                <button
                  className={`text-sm font-semibold ${
                    activeClass(activeTab, 'reels')
                  }`}
                  onClick={() => setActiveTab('reels')}
                >
                  REELS
                </button>
                <button
                  className={`text-sm font-semibold ${
                    activeClass(activeTab, 'tags')
                  }`}
                  onClick={() => setActiveTab('tags')}
                >
                  TAGS
                </button>
              </ul>
              <div>{renderContent()}</div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
  
}

export default profile


