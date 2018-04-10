const express = require('express');
const app = express();

app.use('/', express.static('examples'));

app.listen(3000, () => console.log('Car rental app is listening on port 3000!'));