// quickalerts/index.js
const handleAaveFlashLoan = require('./aave');
const handleGeneralEvent = require('./general');
const handleEthTransfer = require('./eth');
const handleErc20Transfer = require('./erc20');

module.exports = {
  handleAaveFlashLoan,
  handleGeneralEvent,
  handleEthTransfer,
  handleErc20Transfer
};