const { getPaginatedDataFromModel } = require("../../utils");
const { ArticlesModel, ArticlesTagsModel } = require("./models");

const getAllArticles = async (params) => {
  const { page = 1, pageSize = 10, language, slug } = params;
  const query = {};
  if (language) query.language = language;
  if (slug) query.slug = slug;
  return getPaginatedDataFromModel(ArticlesModel, page, pageSize, query);
}

const getArticle = (id) => {
  return ArticlesModel.findById(id);
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
  const list = await MemberModel.find({ "name": { $regex: '.*' + search + '.*', $options: 'i' } });
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
  getTag
}