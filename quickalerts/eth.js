// quickalerts/eth.js
const dbName = process.env.DATABASE_NAME;
const ethCollectionName = process.env.COLLECTION_NAME_ETH;

async function handleEthTransfer(eventData, db) {
  try {
    if (eventData.chain !== 'eth-mainnet') return;
    const collection = db.collection(ethCollectionName);
    const transactionHash = eventData.transactionHash;
    const value = eventData.value / 1e18; // Assuming ETH has 18 decimals

    const ethEvent = {
      transactionHash,
      network: 'eth-mainnet',
      value,
      ...eventData, // Add other relevant fields from eventData
      createdAt: new Date(),
    };
    const result = await collection.insertOne(ethEvent);
    console.log(
      `ETH transfer event recorded with _id: ${result.insertedId}`
    );
  } catch (error) {
    console.error('Error processing ETH transfer event:', error);
    throw error;
  }
}

module.exports = handleEthTransfer;