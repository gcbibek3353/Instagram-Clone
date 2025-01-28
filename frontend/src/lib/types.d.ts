import { ObjectId } from "mongodb";

declare type User = {
  _id: ObjectId;
  userName: string;
  email: string;
  gender: "male" | "female" | "other";
  followers: ObjectId[]; // Array of follower ObjectIds
  following: ObjectId[]; // Array of following ObjectIds
  posts: ObjectId[]; // Array of post ObjectIds
  bookmarks: ObjectId[]; // Array of bookmarked post ObjectIds
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};