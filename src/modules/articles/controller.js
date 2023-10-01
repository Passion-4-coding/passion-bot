const { validateAccess, scopes } = require('../auth');
const {
  getAllArticles,
  updateArticle,
  addArticle,
  addArticleTag,
  getArticle,
  getArticleBySlug,
  getTagsForSearch,
  getAllTags,
  getTag
} = require('./services');

const handleArticlesApi = (app, client) => {
  app.get('/api/articles', async ({ query }, res) => {
    const articles = await getAllArticles(query);
    res.send(articles);
  })

  app.get('/api/articles/:id', async ({ params, headers }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see article"});
      return;
    }
    const response = await getArticle(params.id);
    res.send(response);
  })

  app.get('/api/articles/:slug', async ({ params }, res) => {
    const response = await getArticleBySlug(params.slug);
    res.send(response);
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

  app.get('/api/tags', async ({ query }, res) => {
    const articles = await getAllTags(query);
    res.send(articles);
  })

  app.post('/api/tags', async (req, res) => {
    if (!await validateAccess(req.headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to add tags"});
      return;
    }
    const response = await addArticleTag({ ...req.body, createdOn: new Date(), updatedOn: new Date() });
    res.send(response);
  })

  app.get('/api/tags/search', async ({ headers, query }, res) => {
    console.log
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see tags"});
      return;
    }
    console.log(query.search)
    try {
      const response = await getTagsForSearch(query.search);
      console.log(response)
      res.send(response);
      
    } catch (error) {
      
    }
  })

    app.get('/api/tags/:id', async ({ params, headers }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see tags"});
      return;
    }
    const response = await getTag(params.id);
    res.send(response);
  })
}

module.exports = {
  handleArticlesApi,
}