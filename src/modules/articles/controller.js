const { validateAccess, scopes } = require('../auth');
const { getAllArticles, getArticle, updateArticle, addArticle } = require('./services');

const handleArticlesApi = (app, client) => {
  app.get('/api/articles', async ({ headers, query }, res) => {
    const { page = 1, pageSize = 10 } = query;
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to get articles"});
      return;
    }
    const articles = await getAllArticles(page, pageSize);
    res.send(articles);
  })

  app.post('/api/articles', async (req, res) => {
    if (!await validateAccess(req.headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to add articles"});
      return;
    }
    const response = await addArticle({ ...req.body, createdOn: new Date(), updatedOn: new Date() });
    res.send(response);
  })

  app.patch('/api/articles/:id', async ({ params, headers, body }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to edit articles"});
      return;
    }
    const response = await updateArticle(params.id, body);
    res.send(response);
  })
}

module.exports = {
  handleArticlesApi,
}