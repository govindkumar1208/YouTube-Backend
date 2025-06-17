import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: [true, "Video is a required field"],
    },

    thumbnail: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: "true",
    },

    description: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      required: true,
    },

    isPublished: {
      type: Boolean,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoPublicId: {
      type: String,
      required: true,
    },
    thumbnailPublicId : {
      type : String,
      required : true,
    }
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);