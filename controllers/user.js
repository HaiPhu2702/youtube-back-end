import { response } from "express";
import { createError } from "../error.js";
import User from "../models/user.js"
import Video from "../models/video.js"


export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const userUpdate = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            return res.status(200).json(userUpdate);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, " you can update only your account"));
    }
}


export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("delete success");
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, " you can delete only your account"));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return next(createError(404, "not found user"));
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
};

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        });

        res.status(200).json("subscription successfully");
    } catch (error) {
        next(error);
    }
}

export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })

        res.status(200).json("Unsubscription successfully")
    } catch (error) {
        next(error);
    }
}

export const like = async (req, res, next) => {
    const userId = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: userId },
            $pull: { dislikes: userId }
        });
        res.status(200).json("the video has been liked.")
    } catch (error) {
        next(error);
    }
}

export const dislike = async (req, res, next) => {
    const userId = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet: { dislikes: userId},
            $pull:{likes: userId}
        })
        res.status(200).json("the video has been disliked.")
    } catch (error) {
        next(error);
    }
}