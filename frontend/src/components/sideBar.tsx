import { userAtom } from '@/recoil/user';
import axios from 'axios';
import { Home, LogOut, MessageCircle, PlusSquare, Search, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';
import SearchComp from './Search';

const SideBar = ({ userId }: { userId: string }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    const logOutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                setUser({});
                navigate('/signin');
                toast.success("logged Out successfully")
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

    }

    const navLinkStyles = ({ isActive } : {isActive : unknown}) =>
        //@ts-ignore
        isActive
            ? "flex items-center p-2 bg-gray-100 rounded transition"
            : "flex items-center p-2 hover:bg-gray-100 rounded transition";

    return (
        <div>
            <div className="bg-white hidden lg:block text-gray-800 w-64 h-screen p-10 sticky left-0 top-0 shadow-lg border-r border-gray-200">
                <Link to={`/`}>
                    <h2 className="text-2xl font-bold mb-6">Logo</h2>
                </Link>
                <ul className="space-y-4">
                    <li>
                        <NavLink to={`/`} className={navLinkStyles}>
                            <Home className="mr-2" />
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded transition">
                            <Search className="mr-2" />
                            <SearchComp />
                        </div>
                    </li>
                    {/* <li>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded transition">
                            <TrendingUp className="mr-2" />
                            <span>Explore</span>
                        </div>
                    </li> */}
                    {/* <li>
                        <NavLink className={navLinkStyles} to={`/message/${userId}`} >
                            <MessageCircle className="mr-2" />
                            <span>Message</span>
                        </NavLink>
                    </li> */}
                    {/* <li>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded transition">
                            <Heart className="mr-2" />
                            <span>Notifications</span>
                        </div>
                    </li> */}
                    <li>
                        <NavLink className={navLinkStyles} to={`/createPost/${userId}`} >
                            <PlusSquare className="mr-2" />
                            <span>Create Post</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/profile/${userId}`} className={navLinkStyles}>
                            {user.profilePic_Url ? (
                                <img src={user?.profilePic_Url} alt="profilePic" className="h-10 w-10 rounded-full mr-2" />
                            ) : (
                                <UserRound className="bg-gray-300 mr-2 p-2 rounded-full text-lg w-10 h-10" />
                            )}
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <div onClick={logOutHandler} className="flex items-center p-2 hover:bg-gray-100 rounded transition cursor-pointer">
                            <LogOut className="mr-2" />
                            <span>Log Out</span>
                        </div>
                    </li>
                </ul>
            </div>

                        {/* for small and medium screens */}
            <div className='lg:hidden block fixed bottom-0 left-0 right-0 bg-white border-t w-screen border-gray-200'>
                <div className="flex items-center justify-evenly z-10 py-2">
                    <NavLink to={`/`} className="flex flex-col items-center text-black">
                        <Home />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to={`/message/${userId}`} className="flex flex-col items-center text-black">
                        <MessageCircle />
                        <span>Message</span>
                    </NavLink>
                    <NavLink to={`/createPost/${userId}`} className="flex flex-col items-center text-black">
                        <PlusSquare />
                        <span>Create Post</span>
                    </NavLink>
                    <NavLink to={`/profile/${userId}`} className="flex flex-col items-center text-black">
                        {user.profilePic_Url ? (
                            <img src={user?.profilePic_Url} alt="profilePic" className="h-8 w-8 rounded-full" />
                        ) : (
                            <UserRound className="bg-gray-300 p-1 rounded-full text-lg w-8 h-8" />
                        )}
                        <span>Profile</span>
                    </NavLink>
                </div>

            </div>
        </div>
    );

};

export default SideBar;
