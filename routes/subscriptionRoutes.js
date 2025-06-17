import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
    toggleSubscription ,
    subscriberList,
    channelList
} from "../controllers/subscriptionController.js"
const router = Router();

router.route("/:_id/toggle-subscription").post(verifyJwt, toggleSubscription);
router.route("/:_id/subscriber-list").post(verifyJwt, subscriberList);
router.route("/:_id/channel-list").post(verifyJwt, channelList);



export default router;