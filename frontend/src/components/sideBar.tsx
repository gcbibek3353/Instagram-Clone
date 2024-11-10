import { userAtom } from '@/recoil/user';
import axios from 'axios';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, UserRound} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

const SideBar = ({ userId }: { userId: string }) => {
    const [user,setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    const logOutHandler = async ()=>{
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', { withCredentials: true });
            if(res.data.success){
                setUser({});
                navigate('/signin');
                toast.success("logged Out successfully")
            }
        } catch (error:any) {
            toast.error(error.response.data.message);
        }

    }

    const navLinkStyles = ({ isActive }) =>
        isActive
            ? "flex items-center p-2 bg-gray-700 rounded text-white transition"
            : "flex items-center p-2 hover:bg-gray-700 rounded text-gray-300 transition";

    return (
        <div className="bg-gray-800 text-white w-64 h-screen p-4">
            <h2 className="text-2xl font-bold mb-6">Logo</h2>
            <ul className="space-y-4">
                <li>
                    <NavLink to={`/`} className={navLinkStyles}>
                        <Home className="mr-2" />
                        <span>Home</span>
                    </NavLink>
                </li>
                <li>
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded transition">
                        <Search className="mr-2" />
                        <span>Search</span>
                    </div>
                </li>
                <li>
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded transition">
                        <TrendingUp className="mr-2" />
                        <span>Explore</span>
                    </div>
                </li>
                <li>
                    <NavLink className={navLinkStyles} to={`/message/${userId}`} >
                        <MessageCircle className="mr-2" />
                        <span>Message</span>
                    </NavLink>
                </li>
                <li>
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded transition">
                        <Heart className="mr-2" />
                        <span>Notifications</span>
                    </div>
                </li>
                <li>
                    <NavLink className={navLinkStyles} to={`/createPost/${userId}`} >
                        <PlusSquare className="mr-2" />
                        <span>Create Post</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/profile/${userId}`} className={navLinkStyles}>
                        {/* <User className="mr-2" /> */}
                        {
                            user.profilePic_Url ? 
                            <img src={user?.profilePic_Url} alt='profilePic' className='h-10 w-10 rounded-full' />
                            : <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />
                        }
                       
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <div onClick={logOutHandler} className="flex items-center p-2 hover:bg-gray-700 rounded ">
                        <LogOut className="mr-2" />
                        <span>Log Out</span>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
