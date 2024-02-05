import mongoose from 'mongoose';

const convoSchema = mongoose.Schema(
  {
    // conversationId: {
    //   type: String,
    //   unique: true,
    //   required: true,
    //   index: true,
    // },
    title: {
      type: String,
      default: 'New Chat',
    },

    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', convoSchema);

module.exports = Conversation;
