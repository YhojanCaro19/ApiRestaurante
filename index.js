const express = require('express');
const app = express();

app.use(express.json());

app.use('/platos', require('./routes/platos'));
app.use('/ingredientes', require('./routes/ingredientes'));
app.use('/mesas', require('./routes/mesas'));
app.use('/ordenes', require('./routes/ordenes'));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});