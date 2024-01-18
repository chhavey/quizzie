const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/health', (req, res) => {
    res.send('Server is up and running.');
});

app.use('/user', authRoutes);

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running on port ${process.env.PORT}`))
        .catch((error) => console.log(error.message))
})