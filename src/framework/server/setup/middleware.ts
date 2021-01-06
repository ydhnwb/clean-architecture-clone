import { Express } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import { contentType } from '../middleware/content-type';

export default (app: Express) => {
    app.use(bodyParser.json())
    app.use(cors())
    app.use(contentType)
};
