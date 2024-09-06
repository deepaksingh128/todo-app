const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../src/app');

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.listen(PORT,() => {
    console.log(`Server started at port ${PORT}`);
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Successfully connected to the mongoDB");
    }).catch((err) => {
        console.log("Error in connecting to mongoDB");
    });