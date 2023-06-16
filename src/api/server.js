require("dotenv").config();
const express = require('express');
var cors = require('cors')
const app = express();
const { handleMemberApi } = require("../modules/member");
const { handleAuthApi } = require("../modules/auth");
const { handleQuizApi } = require("../modules/quiz");

const { PORT } = process.env;

const port = PORT || 8080;

app.use(cors());
app.use(express.json());

const init = (client) => {
  handleMemberApi(app);
  handleAuthApi(app, client);
  handleQuizApi(app, client);
}


app.listen(port, () => {
  console.log(`Passion API listening on port ${port}`)
})

module.exports = {
  api: app,
  init
}