const { getPaginatedDataFromModel } = require("../../utils");
const { ArticlesModel, ArticlesTagsModel } = require("./models");

const getAllArticles = async (params) => {
  const { page = 1, pageSize = 10, language, slug } = params;
  const query = { language: "ua" };
  if (language) query.language = language;
  if (slug) query.slug = slug;

  const list = await ArticlesModel.find(query).sort({ publishedOn: -1 }).limit(pageSize).skip(pageSize * (page - 1)).populate("author").populate("tags");
  const total = await ArticlesModel.countDocuments(query);
  return {
    list,
    total
  }
}

const getArticle = (id) => {
  return ArticlesModel.findById(id).populate("author");
}

const getArticleBySlug = (slug) => {
  return ArticlesModel.findOne({ slug, language: "ua" }).populate("author").populate("tags");
}

const addArticle = async (article) => {
  const newArticle = new ArticlesModel(article);
  try {
    return newArticle.save();
  } catch (error) {
    console.error(error);
  }
}

const getTag = (id) => {
  return ArticlesTagsModel.findById(id);
}

const updateArticle = async (id, article) => {
  return ArticlesModel.updateOne({ _id: id }, article);
}

const getAllTags = async (params) => {
  const { page = 1, pageSize = 10 } = params;
  return getPaginatedDataFromModel(ArticlesTagsModel, page, pageSize);
}

const getTagsForSearch = async (search) => {
  const list = await ArticlesTagsModel.find({ "name": { $regex: '.*' + search + '.*', $options: 'i' } });
  return list;
}

const addArticleTag = async (tag) => {
  const newTag = new ArticlesTagsModel(tag);
  try {
    return newTag.save();
  } catch (error) {
    console.error(error);
  }
}

const updateArticleTag = async (id, tag) => {
  return ArticlesTagsModel.updateOne({ _id: id }, tag);
}

module.exports = {
  addArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  addArticleTag,
  updateArticleTag,
  getTagsForSearch,
  getAllTags,
  getTag,
  getArticleBySlug
}