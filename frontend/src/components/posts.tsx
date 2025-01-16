import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Heart, MessageCircle, UserRound, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from 'react-router-dom';


const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/v1/post/getallposts', { withCredentials: true });
                if (res.data && res.data.success) {
                    // console.log(res.data);
                    setPosts(res.data.posts);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, []);

    return (
        <div className="p-6 min-h-screen lg:w-3/4  ">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Posts</h1>
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Post id={post} key={post} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );

};

const Post = ({ id }: { id: any }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);

    const [post, setPost] = useState({
        author: { profilePic_Url: '', userName: '' },
        images: [],
        likes: [],
        comments: [],
        caption: '',
    });

    const [comment, setComment] = useState('');
    const commentRef = useRef(null);
    const [existingComments, setExistingComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/post/getcomment/${id}`, { withCredentials: true });
                if (!res.data || !res.data.success) {
                    console.log(`failed to load comments`);
                }
                console.log(res.data.comments);
                setExistingComments(res.data.comments);
            } catch (error) {
                console.log(error);
            }
        }
        fetchComments();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/post/getpost/${id}`, { withCredentials: true });
                if (!res.data || !res.data.success) {
                    console.log(`failed to load post`);
                }
                //    console.log(res.data.post);
                setPost(res.data.post);
                setIsLiked(res.data.isLiked);
                setIsBookmarked(res.data.isBookmarked);
            } catch (error) {
                console.log(error);
            }
        }
        fetchPost();
    }, [id, isLiked, isBookmarked, comment])


    const addCommentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/comment/${id}`, { text: comment }, { withCredentials: true });
            if (!res.data.success) {
                console.log(`unable to comment`);
            }
            toast.success('commented successfully');
            setComment('');
        } catch (error) {
            console.log(`Unable to comment`);
        }
    }
    const commentHandler = () => {
        if (commentRef) {
            commentRef.current.focus();
            // console.log(commentRef.current);
        }
        else {
            console.log('no comment ref');

        }
    }

    const addLikeHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/api/v1/post/likePost/${id}`, {}, { withCredentials: true });
            if (!res.data.success) {
                console.log(`unable to Like`);
            }
            if (res.data.action === "like") {
                setIsLiked(true);
                // console.log(`post Liked successfully`);
                toast.success(`post Liked successfully`);
            }
            else if (res.data.action === "dislike") {
                setIsLiked(false);
                // console.log(`post Disliked successfully`);
                toast.success(`post Disliked successfully`);
            }


        } catch (error) {
            console.log(`Unable to Like the post`);
        }
    }

    const addBookmarkHandler = async () => {
        try {
            const res = await axios.put(`http://localhost:3000/api/v1/post/bookmark/${id}`, {}, { withCredentials: true });
            // console.log(res);
            if (!res.data.success) {
                // console.log(res);
                // console.log(`unable to Save Post`);
            }
            if (res.data.action === "bookmark") {
                setIsBookmarked(true);
                // console.log(`post saved successfully`);
                toast.success(`post saved successfully`);
            }
            else if (res.data.action === "unbookmark") {
                setIsBookmarked(false);
                // console.log(`post unSaved successfully`);
                toast.success(`post unSaved successfully`);
            }

        } catch (error) {
            console.log(`Unable to Save post`);
        }
    }

    return (
        <div className="border p-5  rounded-lg shadow-md bg-white">
            {/* Post Header */}
            <Link to={`/profile/${post.author?._id}`}
                className="flex items-center mb-4">
                {post.author?.profilePic_Url ? (
                    <img
                        src={post.author.profilePic_Url}
                        alt={`${post.author?.userName}'s profile`}
                        className="h-10 w-10 rounded-full mr-3 z-0"
                    />
                ) : (
                    <UserRound className="bg-gray-300 mr-3 p-2 rounded-full text-gray-600 w-10 h-10" />
                )}
                <h3 className="font-semibold text-gray-800">{post.author?.userName}</h3>
            </Link>

            <Dialog>
                <DialogTrigger className="block w-full">
                    {/* Post Content */}
                    <p className="text-gray-700 text-start mb-4">{post?.caption}</p>

                    <div className="flex justify-center">
                        {post?.images.length > 0 ? (
                            <Carousel className="w-1/2">
                                <CarouselContent>
                                    {post?.images.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <img
                                                src={image}
                                                alt="post image"
                                                className="h-auto rounded-lg object-cover"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {post?.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
                                        <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
                                    </>
                                )}
                            </Carousel>
                        ) : (
                            <p className="text-gray-500">No image</p>
                        )}
                    </div>
                </DialogTrigger>

                <DialogContent className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-gray-800 mb-4">
                            {post?.caption}
                        </DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Carousel Section */}
                                <div className="flex justify-center w-full lg:w-1/2">
                                    {post?.images.length > 0 ? (
                                        <Carousel className="w-full">
                                            <CarouselContent>
                                                {post?.images.map((image, index) => (
                                                    <CarouselItem key={index}>
                                                        <img
                                                            src={image}
                                                            alt="post image"
                                                            className="h-auto rounded-lg object-cover"
                                                        />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            {post?.images.length > 1 && (
                                                <>
                                                    <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
                                                    <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200" />
                                                </>
                                            )}
                                        </Carousel>
                                    ) : (
                                        <p className="text-gray-500">No image</p>
                                    )}
                                </div>

                                {/* Comments Section */}
                                <div className="w-full lg:w-1/2">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Comments
                                    </h3>
                                    {existingComments.length > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            {existingComments.map((comment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg"
                                                >
                                                    {comment?.author?.profilePic_Url ? (
                                                        <img
                                                            src={comment?.author?.profilePic_Url}
                                                            alt={`${comment?.author?.userName}'s profile`}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserRound className="bg-gray-300 p-1 rounded-full text-lg w-10 h-10" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {comment?.author?.userName}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{comment?.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No comments yet.</p>
                                    )}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            




            {/* Post Actions */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4 items-center">
                    {/* <button onClick={post.likes.includes(user.id) ? addDisLikeHandler : addLikeHandler}>
                        <Heart className={post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-500'} />
                    </button> */}
                    <button onClick={addLikeHandler}>
                        <Heart className={isLiked ? 'text-red-500' : 'text-gray-500'} />
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
                <p>{post?.likes.length} Likes</p>
                <p>
                    {post?.comments.length > 0 ? (
                        <DialogTrigger>
                        <span className="cursor-pointer hover:underline text-blue-600">
                            View all {post?.comments.length} comments
                        </span>
                        </DialogTrigger>
                    ) : (
                        'No comments'
                    )}
                </p>
            </div>

            </Dialog>

            {/* Comment Input */}
            <div className="mt-3 flex flex-col lg:flex-row items-center gap-2">
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
