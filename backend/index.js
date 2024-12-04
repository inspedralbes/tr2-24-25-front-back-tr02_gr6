const express = require('express');
const cors = require('cors');
const port = 22555;

const app = express();
app.use(express.json({ limit: '200mb' }));


app.listen(port, () => {
    console.log(`Server corrents a ${port}`);
});