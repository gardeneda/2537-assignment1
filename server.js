'use- strict'

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const client = require(`${__dirname}/src/config/databaseConfig`);

const app = require(`${__dirname}/src/middleware/app`);

const port = process.env.PORT || 5500;

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});

// app.listen(port, () => {
//     console.log(`Listening to port ${port}`);
// })