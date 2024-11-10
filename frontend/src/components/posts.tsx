import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Heart, MessageCircle, UserRound, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/user';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/v1/post/getallposts', { withCredentials: true });
                if (res.data) {
                    // console.log(res.data);
                    setPosts(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            {posts.length > 0 ? (
                <div>
                    {posts.map((post, index) => (
                        <Post post={post} key={post['_id']} />
                    ))}
                </div>
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

const Post = ({ post }: { post: any }) => {
    const user = useRecoilValue(userAtom);
    const [isBookmarked,setIsBookmarked] = useState(false);
    // console.log(user);
    
    const [comment,setComment] = useState('');
    const commentRef = useRef(null);

    const addCommentHandler = async()=>{
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/comment/${post._id}`,{text : comment},{withCredentials : true});
            if(!res.data.success){
                console.log(`unable to comment`);
            }
            toast.success('commented successfully');
            setComment('');
        } catch (error) {
            console.log(`Unable to comment`);
        }
    }
    const commentHandler = ()=>{
        if(commentRef){
            commentRef.current.focus();
            // console.log(commentRef.current);
        }
        else{
            console.log('no comment ref');
            
        }
    }

    const addLikeHandler = async()=>{
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/likePost/${post._id}`,{},{withCredentials : true});
            if(!res.data.success){
                console.log(`unable to Like`);
            }
            console.log(`liked successfully`);
            toast.success(`liked successfully`);
            
        } catch (error) {
            console.log(`Unable to Like the post`);
        }
    }
    const addDisLikeHandler = async()=>{
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/dislikePost/${post._id}`,{},{withCredentials : true});
            if(!res.data.success){
                console.log(`unable to disLike`);
            }
            console.log(`Disliked successfully`);
            toast.success(`Disliked successfully`);
            
        } catch (error) {
            console.log(`Unable to disLike`);
        }
    }
    const addBookmarkHandler = async()=>{
        try {
            const res = await axios.put(`http://localhost:3000/api/v1/post/bookmark/${post._id}`,{},{withCredentials : true});
            if(!res.data.success){
                console.log(res);
                console.log(`unable to Save Post`);
            }
            if(res.data.action === "bookmark"){
                setIsBookmarked(true);
                console.log(`post saved successfully`);
                toast.success(`post saved successfully`);
            }
            else if(res.data.action === "unbookmark"){
                setIsBookmarked(false);
                console.log(`post unSaved successfully`);
                toast.success(`post unSaved successfully`);
            }
            
        } catch (error) {
            console.log(`Unable to Save post`);
        }
    }

    return (
        <div className="border border-gray-300 p-4 rounded-lg mb-4 shadow-md">
            <div className="flex items-center mb-2">
                {(post.author.profilePic_Url) ? (
                    <img src={post.author.profilePic_Url} alt={`${post.author.userName}'s profile`} className="h-10 w-10 rounded-full mr-3" />
                ) : <UserRound className='bg-slate-300 mr-2 p-2 rounded-full text-lg w-10 h-10' />}
                <h3 className="font-semibold">{post.author.userName}</h3>
            </div>
            <div>
                <p className="text-gray-700">{post.caption}</p> {/* Display post content */}
                <div>
                    {
                        post.images.length > 0 ?
                            post.images.map((image: any, index: any) =>
                                <div key={index}>
                                    <img src={image} alt={`post image`} />
                                </div>
                            )
                            : "NO image"
                    }
                </div>
            </div>
            <div>
                <div className='flex justify-between'>
                    <div className='flex gap-4'>
                        {
                            post.likes.includes(user.id) ? <button onClick={addDisLikeHandler}><Heart className='bg-red-500' /></button>  :<button onClick={addLikeHandler}><Heart /></button>
                        }
                        
                        <button onClick={commentHandler}><MessageCircle /></button>
                        <button><ExternalLink /></button>
                    </div>
                    {
                        isBookmarked ? <button className='bg-yellow-400' onClick={addBookmarkHandler}><Bookmark /></button> : <button onClick={addBookmarkHandler}><Bookmark /></button>
                    }
                    
                    
                </div>
                <div>
                    {post.likes.length} Likes
                </div>
                <div>
                    {
                        post.comments.length > 0 ? <span>view all {post.comments.length} comments</span> :"No comments"
                    }
                </div>
                    <div>
                        <input className='outline-none' ref={commentRef} type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder='Add a comment...' />
                        <button onClick={addCommentHandler} >Comment </button>
                    </div>

            </div>
        </div>
    );
};

export default Posts;
