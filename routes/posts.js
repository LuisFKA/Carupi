const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Way of creating another page.
router.get('/', async (request, response) => {
    try{
        //Find is the mongoose method for getting stuff from the db.
        //No parameters means getting all the posts.
        const posts = await Post.find();
        res.json(posts);
    }
    catch(err)
    {
        res.json({message : err});
    }
});

router.post('/', async (req,res) =>
{
    const post = new Post({
        title : req.body.title,
        description: req.body.description
    });
    
    try{
    //Saves the post model data on the db.
    const savedPost = await post.save();
    res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
});

router.get('/:postId', (req,res) =>
{
   
});

module.exports = router;