const express = require('express')
const router = express.Router({mergeParams: true})
const auth = require("../middleware/auth.middleware")
const Comment = require("../models/Comment")


// API COMMENT (get, post)
router
    .route('/')
    .get(auth, async (req, res)=>{

        try{
            const {orderBy, equalTo} = req.query
            const list = await Comment.find({ [orderBy]: equalTo })

            res.send(list)

        }catch (e) {
            res.status(500).json({
                message: `На сервере произошла ошибка. Попробуйте позже`
            })
        }

    })
    .post(auth, async (req, res)=>{

        try{

         const newComment = await Comment.create({
                ...req.body,
                userId: req.user._id
            })
            res.status(201).send(newComment)
        }catch (e) {
            res.status(500).json({
                message: `На сервере произошла ошибка. Попробуйте позже`
            })
        }
    })

//  /api/comment/:id (delete)
router.delete('/:commentId', auth, async (req, res)=>{
    
    try{

        const { commentId } = req.params
        const removeComment = await Comment.findById(commentId)

        if(removeComment.userId.toString() === req.user._id){
            await removeComment.remove()
            return res.send(null)
        }else{
            return res.status(401).json({message: 'Unauthorized'})
        }



    }catch (e) {
        res.status(500).json({
            message: `На сервере произошла ошибка. Попробуйте позже`
        })
    }
})


module.exports = router
