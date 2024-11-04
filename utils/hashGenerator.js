// backend/utils/hashGenerator.js
const crypto = require('crypto');

const generateHash = (data) => {
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${data.salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

module.exports = generateHash;
