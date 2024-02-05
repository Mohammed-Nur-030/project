const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId, // Change the type to ObjectId
      ref: 'Conversation', // Reference the 'Conversation' model
      required: true,
    },
    model: {
      type: String,
    },

    text: {
      type: String,
      required: true,
      meiliIndex: true,
    },

    isCreatedByUser: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;
