const Post = require("../models/postModel");
const path = require("path")
const fs = require("fs")

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Use req.file.path to store the image path if the image is uploaded via multer
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save relative path


        // Create a new post with the title, description, and image path
        const newPost = new Post({
            title,
            description,
            image
        });

        // Save the new post to the database
        await newPost.save();
        
        // Send the newly created post as a response
        res.status(201).json(newPost);
    } catch (error) {
        // If there is an error, send an error response
        res.status(500).json({ message: 'Error creating post', error });
    }
};


// Read all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
}

// Update post
exports.updatePost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, description, image },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error });
    }
};


// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the URL params
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // If an image exists, delete it from the uploads folder
        if (post.image) {
            const imagePath = path.join(__dirname, "..", "uploads", post.image.replace('/uploads/', ''));

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image", err);
                }
            });
        }
        // Delete the post from the database
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post and image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
};