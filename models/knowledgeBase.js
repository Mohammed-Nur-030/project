const mongoose = require('mongoose');
const knowledgeSchema = mongoose.Schema(
  {
    siteURL: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Knowledge =
  mongoose.models.Knowledge || mongoose.model('Knowledge', knowledgeSchema);

module.exports = Knowledge;
