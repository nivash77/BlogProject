import mongoose, { model, models, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    commands: {
      type: [
        {
          username: {
            type: String,
            required: true,
          },
          command: {
            type: String,
            required: true,
          },
        },
      ],
      required: false,
    },
    views: {
    type: Number,
    default: 0,
  },
  viewedBy:{
    type:[String],
    required: true,
    default: [],
  }
  },
  { toJSON: { virtuals: true } }
);

PostSchema.virtual('short_description').get(function () {
  return this.desc.substring(0, 60) + '...';
});
const PostModel = mongoose.models?.Post || mongoose.model('Post', PostSchema);

export default PostModel;