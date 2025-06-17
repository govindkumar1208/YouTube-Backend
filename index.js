import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8001;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening via port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error", err);
        process.exit(1);
  });
