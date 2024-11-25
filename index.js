// require('dotenv').config({ path: './.env' });
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

//appko import kro
import { app } from "./app.js";
import ConnectDB from './DB/index.js'

ConnectDB().then(
    app.listen(process.env.PORT)
)
    .catch((err) => {
        console.error(err);
})

