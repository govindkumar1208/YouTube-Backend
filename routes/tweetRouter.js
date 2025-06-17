import { createTweet,updateTweet,deleteTweet,getUserTweets } from "../controllers/tweetController.js";
import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
const router = Router();
router.route("/createTweet").post(verifyJwt, createTweet);
router.route("/:_id/update-Tweet").patch(verifyJwt, updateTweet);
router.route("/:_id/delete-Tweet").delete(verifyJwt, deleteTweet);
router.route("/:_id/user-Tweets").get(getUserTweets);
export default router;