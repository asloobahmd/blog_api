import { postFieldsValidation } from "../utills/validations.js";
import Post from "../models/postModel.js";

export const getPosts = async (req, res) => {
  const relcat = req.query.cat;
  const currentPostId = req.query.postId;
  try {
    let posts;
    if (!relcat) {
      posts = await Post.find().populate("uid", "id username email");
    } else {
      posts = await Post.find({ cat: relcat }).populate(
        "uid",
        "id username email"
      );
    }
    if (!relcat) {
      return res.status(200).json(posts);
    }
    return res
      .status(200)
      .json(posts.filter((post) => post.id !== currentPostId));
  } catch (error) {
    console.log(error);
  }
};

export const getSinglePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate("uid", "id username email");

    if (!post) return res.status(400).json("Post not found");

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async (req, res) => {
  const { title, desc, img, cat } = req.body;
  try {
    if (!postFieldsValidation(req.body))
      return res.status(400).json("All fields are required");

    //code
    const createdPost = await Post.create({
      title,
      desc,
      img,
      cat,
      uid: req.user.id,
    });

    if (!createdPost) return res.status(400).json("Invalid post data");

    res.status(201).json(createdPost);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const { title, desc, img, cat } = req.body;
  const postId = req.params.id;
  try {
    const postExist = await Post.findById(postId);
    if (!postExist) return res.status(402).json("Post not find");

    if (postExist.uid.toString() !== req.user.id) {
      return res.status(401).json("You are not authorized");
    }

    if (!postFieldsValidation(req.body))
      return res.status(400).json("All fields are required");

    //code
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        desc,
        img,
        cat,
      },
      {
        new: true,
      }
    );

    if (!updatedPost) return res.status(400).json("Invalid post data");

    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const postExist = await Post.findById(postId);
    if (!postExist) return res.status(402).json("Post not find");

    if (postExist.uid.toString() !== req.user.id) {
      return res.status(401).json("You are not authorized");
    }

    await Post.findByIdAndDelete(postId);

    res.status(202).json("Post successfully deleted");
  } catch (error) {
    console.log(error);
  }
};
