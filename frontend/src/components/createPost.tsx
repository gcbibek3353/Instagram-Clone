import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { readFileAsDataURL } from "@/lib/utils";
// import { toast } from "sonner"
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
import { UserRound } from "lucide-react";


const createPost = () => {
  const user = useRecoilValue(userAtom);
  const [files, setFiles] = useState("");
  const [imagePreviews,setImagePreviews] = useState<string[]>([]);

  // const navigate = useNavigate();
  const imgRef = useRef();
  const [caption, setCaption] = useState('');

  const postCreateHandler = async (e: any) => {
    e.preventDefault();
  }

  const fileChangeHandler = async(e : any)=>{
    const files = e.target.files;
    console.log('files are ' + files);
    if(!files || files.length === 0){
      console.log('No file selected');
    }
    else{
      setFiles(files);
      const dataUrls = files.map(async(file: any) => await readFileAsDataURL(file));
      setImagePreviews(dataUrls);
    }
  }

  const handleButtonClick = ()=>{
    if(imgRef.current){
      imgRef.current.click();
    }
  }
  return (

    <div>
      <div>
        <h2> Create New Post  </h2>
      </div>
      <div>
      {user.userName? (
        <Link to={`/profile/${user.id}`}  className='flex gap-2'>
          {
            user.profilePic_Url ?
             <img src={user.profilePic_Url} alt={"user_Pic"} className='w-10 h-10 rounded-full' />
             :  <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />
          }
          
          <div>
            <p>{user.userName}</p>
          </div>
        </Link >
      ) : (
        <p>Loading userInfo...</p>
      )}
    </div>
      <form onSubmit={postCreateHandler}>
        <Input
          type="text"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent my-2"
          placeholder="Write a caption ..."
        />
        {
          imagePreviews && imagePreviews.length > 0 && (
            <div>
              {imagePreviews.map((image, index) => (
                <img key={index} src={image} alt="preview" className="w-20 h-20" />
              ))}
            </div>
          )
        }

        <input type="file"
        name="postImage"
        ref = {imgRef}
        className="hidden"
        onChange={fileChangeHandler}
         />
         <button 
        onClick={handleButtonClick}
         >Select from Computer</button>
         <button type="submit" className="w-full">Post</button>
      </form>
    </div>
  )
}


export default createPost
