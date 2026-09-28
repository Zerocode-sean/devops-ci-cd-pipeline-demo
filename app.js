const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('CI/CD Pipeline  V1 Working!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Health' 
  });
});


app.listen(3000);