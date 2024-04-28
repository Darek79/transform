import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_STRING;

let db;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        connectTimeoutMS: 10000,
    },
});

export async function mongoClient(database) {
    try {
        if (db) {
            console.log('already connect');
            return db;
        }
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        db = client.db(database);
        return db;
    } catch (error) {
        if (error) {
            console.log('connection error');
            process.exit(1);
        }
    }
}
