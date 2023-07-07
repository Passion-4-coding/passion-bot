const { getPaginatedDataFromModel } = require("../../utils");
const { ArticlesModel } = require("./models");

const getAllArticles = async (page, pageSize, language) => {
  if (language) {
    return getPaginatedDataFromModel(ArticlesModel, page, pageSize, { language });
  }
  return getPaginatedDataFromModel(ArticlesModel, page, pageSize);
}

const getArticle = (id) => {
  return ArticlesModel.findById(id);
}

const getArticleByQuery = (query) => {
  return ArticlesModel.findOne(query);
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
  getArticleByQuery
}