const cors = require('cors');

const corsMiddleware = cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']
});

module.exports = corsMiddleware;
