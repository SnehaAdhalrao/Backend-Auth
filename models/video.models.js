import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema = new mongoose.Schema({
    videofile: {
        type: String,  //cloudinary se mlega
      required: true  
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    ispublished: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });


videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);