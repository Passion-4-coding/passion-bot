const { getPaginatedDataFromModel } = require("../../utils");
const { ArticlesModel } = require("./models");

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

const updateArticle = async (id, article) => {
  return ArticlesModel.updateOne({ _id: id }, article);
}

module.exports = {
  addArticle,
  getAllArticles,
  getArticle,
  updateArticle,
}