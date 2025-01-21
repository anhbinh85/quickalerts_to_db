require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB connection details from environment variables
const uri = process.env.MONGODB_URI; // Use the URI directly from the .env file
const dbName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    app.post('/webhook', async (req, res) => {
      try {
        const events = req.body;

        for (const eventData of events) {
          const blockNumber = parseInt(eventData.blockNumber, 16);
          const blockHash = eventData.blockHash;
          const transactionHash = eventData.transactionHash;
          const network = eventData.chain;

          // Log the query and values for debugging
          console.log(
            'Executing query: INSERT INTO quickalerts_events (block_number, block_hash, transaction_hash, network, event_data) VALUES ($1, $2, $3, $4, $5)'
          );
          console.log('Values:', [
            blockNumber,
            blockHash,
            transactionHash,
            network,
            JSON.stringify(eventData),
          ]);

          // Insert into the database
          const result = await collection.insertOne({
            blockNumber,
            blockHash,
            transactionHash,
            network,
            eventData, // Store the entire event data as a document
            createdAt: new Date(), // Add a timestamp for when the record is created
          });

          console.log('Event recorded with _id:', result.insertedId);
        }

        res.status(200).send('Events received and recorded');
      } catch (error) {
        console.error('Error processing webhook:', error);

        // Log more details about the error from MongoDB
        if (error.code) {
          console.error('MongoDB error code:', error.code);
        }
        if (error.message) {
          console.error('MongoDB error message:', error.message);
        }
        if (error.name) {
          console.error('MongoDB error name:', error.name);
        }
        if (error.response) {
          console.error('MongoDB error response:', error.response);
        }

        res.status(500).send('Error processing event');
      }
    });

    app.listen(PORT, () => {
      console.log(`Webhook server listening on port ${PORT}`);
    });
  } catch (err) {
    console.dir(err);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);