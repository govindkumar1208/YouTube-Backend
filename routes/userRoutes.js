import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  getWatchHistory,
  getUserChannelProfile,
  updateEmail,
  updateFullName,
  updateUsername,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/changepassword").post(verifyJwt, changeCurrentPassword);

router.route("/current-user").get(verifyJwt, getCurrentUser);

router.route("/update-email").patch(verifyJwt, updateEmail);

router.route("/update-fullname").patch(verifyJwt, updateFullName);

router.route("/update-username").patch(verifyJwt, updateUsername);

router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);

router
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJwt, getUserChannelProfile);

router.route("/history").get(verifyJwt, getWatchHistory);

export default router;
