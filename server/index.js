const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.get('/health', (req, res) => {
    res.send('Server is up and running.');
})

app.listen(process.env.PORT, () => {
    console.log("Server running on port ", process.env.PORT);
})