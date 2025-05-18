const express = require('express');
const request = require('request');
const app = express();

app.use((req, res) => {
  const url = 'https://api.imgbb.com' + req.url;
  req.pipe(request({ qs: req.query, uri: url })).pipe(res);
});

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});