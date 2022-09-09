
import Video from "../models/video.js"
import User from "../models/user.js"
import {createError} from "../error.js"

export const addVideo = async (req, res, next) => {
    const newVideo = await Video({
        userId: req.user.id,
        ...req.body
    })
    try {
        await newVideo.save();
        res.json(newVideo);
    } catch (error) {
        next(error);
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Not found"));

        console.log(req.user.id,video.userId)

        if (req.user.id === video.userId) {
            const updateVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updateVideo)
        }
            return res.status(403).json("you can't update this video because not your video");

    } catch (error) {
        next(error);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "NotFound video"))
        if (req.user.id === video.userId) {

            await Video.findByIdAndDelete(req.params.id)
            return res.status(200).json("delete successfully")
        }
        return res.status(403).json({success:false,message:"you can't delete this video because not your video"})

    } catch (error) {
        throw error.message
        next(error);
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "NotFound video"));
        res.status(200).json(video)
    } catch (error) {
        next(error);
    }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })
        res.status(200).json("the views has been increased")
    } catch (error) {
        next(error);
    }
}

export const trend = async (req, res, next) => {
    try {
        const Videos = await Video.find().sort({ views: -1 })
        res.status(200).json(Videos)
    } catch (error) {
        next(error);
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(videos)
    } catch (error) {
        next(error);
    }
}

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(channelId => {
                return Video.find({ userId: channelId })
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createAt - a.createAt))
    } catch (error) {
        next(error);
    }
}

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    // console.log(tags)
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        // console.log(videos)
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const search = async (req, res, next) => {
    try {
        const search=req.query.q;
        const videos= await Video.find({title:{$regex:search,$options:"i"}});
        res.status(200).json(videos);

    } catch (error) {
        next(error);
    }
}