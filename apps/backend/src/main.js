import express from 'express';
const { Transform } = require('node:stream');
import { mongoClient } from './mongo_client';

const jsconToCSVTransform = new Transform({
    writableObjectMode: true,
    readableObjectMode: false,
    transform(chunk, encoding, callback) {
        const csvRow = `${chunk.Site},${chunk.Domain},${chunk.Impressions},${chunk.Clicks},${chunk.Revenue}\n`;
        console.log(csvRow);
        this.push(csvRow);
        callback();
    },
});

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
app.get('/', async (req, res) => {
    try {
        console.log(req.params, 'params');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
        const db = await mongoClient('adsizes');
        const cursor = db.collection('adsizes').find({}).limit(100).stream();

        const jsconToCSVTransform = new Transform({
            writableObjectMode: true,
            readableObjectMode: false,
            transform(chunk, encoding, callback) {
                const csvRow = `${chunk.Site},${chunk.Domain},${chunk.Impressions},${chunk.Clicks},${chunk.Revenue}\n`;
                console.log(csvRow);
                this.push(csvRow);
                callback();
            },
        });

        cursor.pipe(jsconToCSVTransform).pipe(res);
        res.on('finish', () => {
            console.info('is done');
            // Handle cleanup if necessary
        });
    } catch (error) {
        console.log(error, '1');
    }
});
app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
