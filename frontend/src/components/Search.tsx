import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import axios from "axios";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
  

const SearchComp = () => {
    const [open,setOpen] = useState(false);
    const [users,setUsers] = useState([]);
    
    const [searchVal,setSearchVal] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const getAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/getalluser', { withCredentials: true });
            if (res.data.success) {
              console.log(res.data.users);
                setUsers(res.data.users);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    useEffect(()=>{
      getAllUsers();
    },[])

    useEffect(() => {
      if (searchVal.length > 0) {
          setIsSearching(true);
          const results = users.filter((user) =>
              user?.userName.toLowerCase().includes(searchVal.toLowerCase())
          );
          setSearchResults(results.slice(0, 5));
      } else {
          setIsSearching(false);
          setSearchResults([]);
      }
  }, [users, searchVal]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger className="transition duration-200">
    Search
  </DialogTrigger>
  <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold mb-4 text-gray-800">
        Search For Users
      </DialogTitle>
      <div>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type a username..."
        />
        <div className="flex flex-col gap-2 mt-4">
          {isSearching &&
            (searchResults?.length > 0 ? (
              searchResults?.map((user: any) => (
                <Link to={`/profile/${user._id}`}
                onClick={()=>setOpen(false)}
                  key={user._id}
                  className="flex items-center gap-3 bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition duration-200"
                >
                  {user.profilePic_Url ? (
                    <img
                      src={user.profilePic_Url}
                      alt={`${user.userName}'s profile`}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserRound className="bg-gray-300 p-1 rounded-full text-lg w-8 h-8" />
                  )}
                  <p className="text-gray-700">{user.userName}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found</p>
            ))}
        </div>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}

export default SearchComp