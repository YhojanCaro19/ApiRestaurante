require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const apiKey = req.headers['password'];
  if (!apiKey) return res.status(401).json({ success: false, message: 'API key requerida' });
  if (apiKey !== process.env.API_PASSWORD) {
    return res.status(403).json({ success: false, message: 'Password incorrecta' });
  }
  next();
});

app.use('/mesas',        require('./routes/mesas'));
app.use('/platos',       require('./routes/platos'));
app.use('/ingredientes', require('./routes/ingredientes'));
app.use('/ordenes',      require('./routes/ordenes'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`API corriendo en http://localhost:${server.address().port}`)
);
