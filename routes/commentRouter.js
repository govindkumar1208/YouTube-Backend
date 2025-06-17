import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";
import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/:_id/add-comment").post(verifyJwt, addComment);

router.route("/:_id/getVideoComment").post(getVideoComments);

router.route("/:_id/update-comment").patch(verifyJwt, updateComment);

router.route("/:_id/delete-comment").delete(verifyJwt, deleteComment);

export default router;