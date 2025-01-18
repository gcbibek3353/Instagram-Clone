import React, { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { readFileAsDataURL } from "@/lib/utils";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
import { UserRound } from "lucide-react";
import { toast } from "sonner";


const createPost = () => {
  const user = useRecoilValue(userAtom);
  const [files, setFiles] = useState([]);
  const [imagePreviews,setImagePreviews] = useState<string[]>([]);
  const [Loading,setLoading] = useState(false);

  const navigate = useNavigate();
  const imgRef = useRef();
  const [caption, setCaption] = useState('');

  const fileChangeHandler = async(e : any)=>{
    console.log('fileChangeHandler called');
    const files = e.target.files;
    console.log(files);
    const fileArray = Array.from(files);

    if(!files || files.length === 0){
      console.log('No file selected');
    }
    else{
      setFiles(fileArray);
      const dataUrls = await Promise.all(
        fileArray.map((file: any) => readFileAsDataURL(file))
      );
      setImagePreviews(dataUrls);
    }
  }

  const postCreateHandler = async (e : React.FormEvent) => {
    e.preventDefault();
    if(caption.trim() === ''){
      return toast.error('Caption is required');
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePreviews) files.forEach((file) => {
      formData.append("images", file);
  });

    try {
      setLoading(true);
      console.log(formData);
      const res = await axios.post('http://localhost:3000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        // dispatch(setPosts([res.data.post, ...posts]));// [1] -> [1,2] -> total element = 2
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  const handleButtonClick = ()=>{
    if(imgRef.current){
      imgRef.current.click();
    }
  }

  return (

    <div className="flex items-center justify-center flex-col min-h-screen gap-4">
    {/* Header */}
    <div className="text-center border-b pb-4">
      <h2 className="text-2xl font-semibold text-gray-800">Create New Post</h2>
    </div>
  
    {/* User Info */}
    <div className="flex items-center gap-4">
      {user.userName ? (
        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
          {user.profilePic_Url ? (
            <img
              src={user.profilePic_Url}
              alt="User Pic"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="bg-slate-300 flex items-center justify-center rounded-full w-12 h-12">
              <UserRound className="text-lg" />
            </div>
          )}
          <div>
            <p className="text-lg font-medium text-gray-700">{user.userName}</p>
          </div>
        </Link>
      ) : (
        <p className="text-gray-500">Loading user info...</p>
      )}
    </div>
  
    {/* Caption Input */}
    <div>
      <Input
        type="text"
        name="caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Write a caption..."
      />
    </div>
  
    {/* Image Previews */}
    {imagePreviews && imagePreviews.length > 0 && (
      <div className="flex gap-3 overflow-x-auto">
        {imagePreviews.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md border"
          />
        ))}
      </div>
    )}
  
    {/* File Input and Buttons */}
    <div className="flex flex-col items-center space-y-4">
      {/* Hidden File Input */}
      <input
        type="file"
        name="postImage"
        ref={imgRef}
        className="hidden"
        onChange={fileChangeHandler}
        multiple
      />
  
      {/* Select and Submit Buttons */}
      <button
        onClick={handleButtonClick}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
      >
        Select from Computer
      </button>
      <button
        type="submit"
        onClick={postCreateHandler}
        disabled={Loading}
        className={`w-full px-4 py-2 rounded-lg font-medium text-white ${
          Loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 transition"
        }`}
      >
        {Loading ? "Posting..." : "Post"}
      </button>
    </div>
  </div>
  
  )
}


export default createPost
