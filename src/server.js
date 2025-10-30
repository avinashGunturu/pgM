// server.js
const app = require('./app');
const config = require('./config/config');

const port = config.port || 4000;

app.listen(port, () => {
//   logger.info(`Server listening on port ${port}`);
    console.log(`Server listening on port ${port}`);
});