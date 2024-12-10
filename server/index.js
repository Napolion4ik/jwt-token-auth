require("dotenv").config();
const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const moongose = require("mongoose");
const { default: mongoose } = require("mongoose");

const router = require("./router/index")
const errorMidellware = require("./middelwares/error-middalware")

const PORT = process.env.PORT || 5001
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT_URL
    }
));

app.use('/api', router)
app.use(errorMidellware)

const start = async () => {
    try {

        await mongoose.connect(process.env.DB_URL)

        app.listen(PORT, () => {
            console.log("SERVER RUN ON PORT ", PORT);
            
        })
    } catch (e) {
        console.error(e);
    }
}


start()