const express = require("express");

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS'){
      return res.sendStatus(200);
    }
      next();
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});