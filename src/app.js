import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routers from "../routers/indexRouters.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routers);

const port = process.env.PORT;

app.listen(port || 4000, () => {
    console.log('Ouvindo na porta 5000')
})