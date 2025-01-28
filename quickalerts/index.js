// quickalerts/index.js
const handleAaveFlashLoan = require('./aave');
const handleGeneralEvent = require('./general');

module.exports = {
  handleAaveFlashLoan,
  handleGeneralEvent,
};