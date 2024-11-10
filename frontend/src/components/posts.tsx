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
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Posts</h1>
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Post post={post} key={post['_id']} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
    
};

const Post = ({ post }: { post: any }) => {
    const user = useRecoilValue(userAtom);
    const [isBookmarked,setIsBookmarked] = useState(false);
    const [isLiked,setIsLiked] = useState(false);
    // console.log(post);
    // console.log(user);
    // if(post.likes.includes(user.id)) setIsLiked(true)
    // if(user.bookmarks.includes(post['_id'])) setIsBookmarked(true)

    
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
            if(res.data.action === "like"){
                setIsLiked(true);
                // console.log(`post Liked successfully`);
                toast.success(`post Liked successfully`);
            }
            else if(res.data.action === "dislike"){
                setIsLiked(false);
                console.log(`post Disliked successfully`);
                toast.success(`post Disliked successfully`);
            }
    
            
        } catch (error) {
            console.log(`Unable to Like the post`);
        }
    }
    // const addDisLikeHandler = async()=>{
    //     try {
    //         const res = await axios.post(`http://localhost:3000/api/v1/post/dislikePost/${post._id}`,{},{withCredentials : true});
    //         if(!res.data.success){
    //             console.log(`unable to disLike`);
    //         }
    //         console.log(`Disliked successfully`);
    //         toast.success(`Disliked successfully`);
            
    //     } catch (error) {
    //         console.log(`Unable to disLike`);
    //     }
    // }
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
        <div className="border border-gray-200 p-5 rounded-lg shadow-md bg-white">
            {/* Post Header */}
            <div className="flex items-center mb-4">
                {post.author.profilePic_Url ? (
                    <img
                        src={post.author.profilePic_Url}
                        alt={`${post.author.userName}'s profile`}
                        className="h-10 w-10 rounded-full mr-3"
                    />
                ) : (
                    <UserRound className="bg-gray-300 mr-3 p-2 rounded-full text-gray-600 w-10 h-10" />
                )}
                <h3 className="font-semibold text-gray-800">{post.author.userName}</h3>
            </div>
    
            {/* Post Content */}
            <p className="text-gray-700 mb-4">{post.caption}</p>
    
            {/* Post Images */}
            <div className="space-y-4">
                {post.images.length > 0 ? (
                    post.images.map((image, index) => (
                        <div key={index}>
                            <img
                                src={image}
                                alt="post image"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No image</p>
                )}
            </div>
    
            {/* Post Actions */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4 items-center">
                    {/* <button onClick={post.likes.includes(user.id) ? addDisLikeHandler : addLikeHandler}>
                        <Heart className={post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-500'} />
                    </button> */}
                    <button onClick={addLikeHandler}>
                        <Heart className={isLiked ?  'text-red-500' : 'text-gray-500'} />
                    </button>
                    <button onClick={commentHandler}>
                        <MessageCircle className="text-gray-500" />
                    </button>
                    <button>
                        <ExternalLink className="text-gray-500" />
                    </button>
                </div>
                <button onClick={addBookmarkHandler}>
                    <Bookmark className={isBookmarked ? 'text-yellow-500' : 'text-gray-500'} />
                </button>
            </div>
    
            {/* Post Like and Comment Info */}
            <div className="mt-4 text-gray-600 text-sm">
                <p>{post.likes.length} Likes</p>
                <p>
                    {post.comments.length > 0 ? (
                        <span className="cursor-pointer text-blue-600">
                            View all {post.comments.length} comments
                        </span>
                    ) : (
                        'No comments'
                    )}
                </p>
            </div>
    
            {/* Comment Input */}
            <div className="mt-3 flex items-center gap-2">
                <input
                    ref={commentRef}
                    type="text"
                    className="flex-1 px-3 py-2 text-gray-800 bg-gray-100 rounded-full outline-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button
                    onClick={addCommentHandler}
                    className="text-blue-500 font-semibold"
                >
                    Comment
                </button>
            </div>
        </div>
    );
    
};

export default Posts;
