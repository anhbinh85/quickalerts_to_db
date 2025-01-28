// quickalerts/erc20.js
const dbName = process.env.DATABASE_NAME;
const erc20CollectionName = process.env.COLLECTION_NAME_ERC20;

async function handleErc20Transfer(eventData, db) {
  try {
    if (eventData.chain !== 'eth-mainnet') return;
    const collection = db.collection(erc20CollectionName);
    const transactionHash = eventData.transactionHash;

    for (const log of eventData.logs) {
      const tokenEvent = {
        transactionHash,
        network: 'eth-mainnet',
        ...log, // Store all log data
        createdAt: new Date(),
      };
      const result = await collection.insertOne(tokenEvent);
      console.log(
        `ERC-20 transfer event recorded with _id: ${result.insertedId}`
      );
    }
  } catch (error) {
    console.error('Error processing ERC-20 transfer event:', error);
    throw error;
  }
}

module.exports = handleErc20Transfer;