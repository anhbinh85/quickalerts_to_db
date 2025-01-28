// quickalerts/aave.js
const dbName = process.env.DATABASE_NAME;
const aaveCollectionName = process.env.COLLECTION_NAME_AAVE;

async function handleAaveFlashLoan(eventData, db) {
  try {
    const aaveCollection = db.collection(aaveCollectionName);
    const transactionHash = eventData.transactionHash;

    for (const log of eventData.logs) {
      if (
        log.address.toLowerCase() ===
          '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2'.toLowerCase() &&
        log.topics.includes(
          '0xefefaba5e921573100900a3ad9cf29f222d995fb3b6045797eaea7521bd8d6f0'
        )
      ) {
        const flashLoanEvent = {
          transactionHash: transactionHash,
          logIndex: log.logIndex,
          ...log,
          createdAt: new Date(),
        };
        const aaveResult = await aaveCollection.insertOne(flashLoanEvent);
        console.log(
          'Aave flash loan event recorded with _id:',
          aaveResult.insertedId
        );
      }
    }
  } catch (error) {
    console.error('Error processing Aave flash loan event:', error);
    throw error; // Re-throw to allow for handling in the main app
  }
}

module.exports = handleAaveFlashLoan;