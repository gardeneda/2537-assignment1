'use- strict'

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require(`${__dirname}/src/middleware/app`);

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})