require("dotenv").config();
const express = require('express');
const { handleMemberApi } = require("../modules/member");
const app = express();

const { PORT } = process.env;

const port = PORT || 8080;

handleMemberApi(app);

app.listen(port, () => {
  console.log(`Passion API listening on port ${port}`)
})

module.exports = {
  api: app
}