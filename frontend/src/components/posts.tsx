import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
                    {posts.map((post,index) => (
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
    return (
        <div className="border border-gray-300 p-4 rounded-lg mb-4 shadow-md">
            <div className="flex items-center mb-2">
                {post.author.profilePic_Url && (
                    <img src={post.author.profilePic_Url} alt={`${post.author.userName}'s profile`} className="h-10 w-10 rounded-full mr-3" />
                )}
                <h3 className="font-semibold">{post.author.userName}</h3>
            </div>
            <div>
                <p className="text-gray-700">{post.caption}</p> {/* Display post content */}
                <div>
                    {
                        post.images.length > 0 ? 
                        post.images.map((image : any,index : any)=>
                            <div key={index}>
                            <img src={image} alt={`post image`} />
                            </div>
                        )
                        : "NO image"
                    }
                </div>
            </div>
        </div>
    );
};

export default Posts;
