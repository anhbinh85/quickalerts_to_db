// quickalerts/general.js
const dbName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;

async function handleGeneralEvent(eventData, db) {
  try {
    const collection = db.collection(collectionName);

    const blockNumber = parseInt(eventData.blockNumber, 16);
    const blockHash = eventData.blockHash;
    const transactionHash = eventData.transactionHash;
    const network = eventData.chain;

    const transactionDocument = {
      blockNumber,
      blockHash,
      transactionHash,
      network,
      eventData,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(transactionDocument);
    console.log('Event recorded with _id:', result.insertedId);
  } catch (error) {
    console.error('Error processing general event:', error);
    throw error; // Re-throw to allow for handling in the main app
  }
}

module.exports = handleGeneralEvent;