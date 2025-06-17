import { Router } from "express";
import {
  publishVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
togglePublishStatus,
getAllVideos,
} from "../controllers/videoController.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/publish-video").post(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "watchoVideo",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  publishVideo
);

router.route("/:_id/get-video").post(getVideoById);

router.route("/:_id/delete-video").delete(verifyJwt, deleteVideo);

router.route("/:_id/update-video").patch(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "watchoVideo",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateVideo
);

router.route("/:_id/toggle-publishStatus").patch(verifyJwt,togglePublishStatus);

router.route("/:_id/get-videos").post(getAllVideos);

export default router;
