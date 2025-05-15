// serverActions.js
"use server";

import {ConnectMongodb } from "../utils/ConnectMongodb";
import PostModel from "../../Model/PostModel";
import mongoose from "mongoose";

// Fetch all posts
export async function getPosts() {
  await ConnectMongodb();
  const posts = await PostModel.find({}).lean();

  const plainPosts = posts.map((post, index) => {
    const shortDesc = post.short_description || (post.desc ? post.desc.substring(0, 60) + (post.desc.length > 60 ? "..." : "") : "");
     let indexValue = index + 1;
    console.log("indexValue", indexValue);
    let dateValue;
    if (post.date instanceof Date) {
      dateValue = post.date.toISOString();
    } else if (typeof post.date === "string") {
      dateValue = post.date;
    } else {
      dateValue = null;
    }

    return {
      _id: post._id ? post._id.toString() : null,
      title: post.title || null,
      desc: post.desc || null,
      short_description: shortDesc,
      img: post.img ? post.img.toString("base64") : null,
      author: post.author ? post.author.toString() : null,
      date: dateValue,
      commands: post.commands
        ? post.commands.map((cmd) => ({
            ...cmd,
            _id: cmd._id ? cmd._id.toString() : null,
            username: cmd.username || null,
            command: cmd.command || null,
          }))
        : [],
      __v: post.__v || 0,
    };
  });

  return plainPosts;
}

// Fetch a single post by ID
export async function getPostById(id) {
  try {
    await ConnectMongodb();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid post ID");
    }

    const post = await PostModel.findById(id).lean();
    if (!post) {
      throw new Error("Post not found");
    }

    const shortDesc = post.short_description || (post.desc ? post.desc.substring(0, 60) + (post.desc.length > 60 ? "..." : "") : "");

    let dateValue;
    if (post.date instanceof Date) {
      dateValue = post.date.toISOString();
    } else if (typeof post.date === "string") {
      dateValue = post.date;
    } else {
      dateValue = null;
    }

    return {
      _id: post._id ? post._id.toString() : null,
      title: post.title || null,
      desc: post.desc || null,
      short_description: shortDesc,
      img: post.img ? post.img.toString("base64") : null,
      author: post.author ? post.author.toString() : null,
      date: dateValue,
      commands: post.commands
        ? post.commands.map((cmd) => ({
            ...cmd,
            _id: cmd._id ? cmd._id.toString() : null,
            username: cmd.username || null,
            command: cmd.command || null,
          }))
        : [],
      __v: post.__v || 0,
    };
  } catch (error) {
    console.error("Error fetching post:", error.message);
    throw new Error(error.message);
  }
}

// Add a comment to a post
export async function addCommand({ postId, username, command }) {
  try {
    await ConnectMongodb();
    if (!postId || !username || !command) {
      throw new Error("Post ID, username, and comment are required");
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.commands.push({ username, command });
    await post.save();

    return { success: true, message: "Comment added successfully" };
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw new Error(error.message);
  }
}

// Update a comment in a post
export async function updateCommand({ postId, username, command }) {
  try {
    await ConnectMongodb();
    if (!postId || !username || !command) {
      throw new Error("Post ID, username, and comment are required");
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }
    if (command.trim() === "") {
      throw new Error("Comment cannot be empty");
    }

    const updateResult = await PostModel.findOneAndUpdate(
      { _id: postId, "commands.username": username },
      { $set: { "commands.$.command": command } },
      { new: true }
    );

    if (!updateResult) {
      throw new Error("Comment not found or no changes made");
    }

    return { success: true, message: "Comment updated successfully" };
  } catch (error) {
    console.error("Error updating comment:", error.message);
    throw new Error(error.message);
  }
}

// Delete a comment from a post
export async function deleteCommand({ postId, username, command }) {
  try {
    await ConnectMongodb();
    if (!postId || !username || !command) {
      throw new Error("Post ID, username, and comment are required");
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    const updateResult = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { commands: { username, command } } },
      { new: true }
    );

    if (!updateResult) {
      throw new Error("Comment not found or no changes made");
    }

    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    throw new Error(error.message);
  }
}
