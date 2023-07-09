const mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  createdOn: {
    type: Date,
    required: true
  },
  updatedOn: {
    type: Date,
    required: true
  },
  publishedOn: {
    type: Date,
    required: true
  },
  language: {
    type: String,
    enum: ["ua", "en"],
    required:  true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  titleCompact: {
    type: String,
    required: true
  },
  contentCompact: {
    type: String,
    required: true
  },
  titleSeo: {
    type: String,
    required: true,
  },
  descriptionSeo: {
    type: String,
    required: true,
  },
  keywordsSeo: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  pending: {
    type: Boolean,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

const ArticlesModel = mongoose.model('articles', ArticlesSchema);

module.exports = {
  ArticlesSchema,
  ArticlesModel
}