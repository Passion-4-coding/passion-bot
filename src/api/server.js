require("dotenv").config();
const express = require('express');
const app = express();

const { PORT } = process.env;

const { Database } = require("../config/db");
const db = new Database();

app.get('/api/member-count', async (req, res) => {
  const count = await db.getMembersCount();
  res.send(count.toString());
})

const port = PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})