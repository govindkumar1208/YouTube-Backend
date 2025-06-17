import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  console.log("Healthcheck endpoint hit");
  return res
    .status(200)
    .json(new ApiResponse(200, "Ok", "Health Check Passed"));
});

export { healthcheck };
