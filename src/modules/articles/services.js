const { getPaginatedDataFromModel } = require("../../utils");
const { ArticlesModel } = require("./models");

const getAllArticles = async (page, pageSize) => {
  return getPaginatedDataFromModel(ArticlesModel, page, pageSize);
}

const getArticle = (id) => {
  return ArticlesModel.findById(id);
}

const getArticlesBySlug = (slug) => {
  return ArticlesModel.find({ slug });
}

const addArticle = async (article) => {
  const newArticle = new ArticlesModel(article);
  try {
    return newArticle.save();
  } catch (error) {
    console.error(error);
  }
}

const updateArticle = async (id, article) => {
  return ArticlesModel.updateOne({ _id: id }, article);
}

module.exports = {
  addArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  getArticlesBySlug
}