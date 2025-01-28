// index.js
require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const {
  handleAaveFlashLoan,
  handleGeneralEvent,
  handleEthTransfer,
  handleErc20Transfer
} = require('./quickalerts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));

// MongoDB connection details from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

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
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const database = client.db(dbName);

    app.post('/webhook', async (req, res) => {
      try {
        const events = req.body;

        for (const eventData of events) {
          // Call the appropriate handler function based on the event type
          await handleGeneralEvent(eventData, database); // Handle general events
          await handleAaveFlashLoan(eventData, database); // Handle Aave flash loan events
          await handleEthTransfer(eventData, database);
          await handleErc20Transfer(eventData, database);
        }

        res.status(200).send('Events received and recorded');
      } catch (error) {
        console.error('Error handling webhook:', error);
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