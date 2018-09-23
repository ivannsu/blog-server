require('dotenv').config();

module.exports = (password) => {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', process.env.CRYPT_SECRET_KEY)
                     .update(password)
                     .digest('hex');
  return hash;
}                  