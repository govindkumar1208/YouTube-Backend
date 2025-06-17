import { Router } from "express";
import {
  toggleVideoLike,
  toggleTweetLike,
  toggleCommentLike,
  getLikedVideos,
} from "../controllers/likeController.js";
 import { verifyJwt } from "../middlewares/auth.middlewares.js";
const router = Router();
router.route("/:_id/toggle-videolike").post(verifyJwt,toggleVideoLike);

router.route("/:_id/toggle-tweetlike").post(verifyJwt,toggleTweetLike);

router.route("/:_id/toggle-commentlike").post(verifyJwt,toggleCommentLike);

router.route("/liked-videos").post(verifyJwt, getLikedVideos);



export default router;