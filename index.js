require('dotenv').config()
require('./dbconnect')
const app = require('./app')
const port = process.env.PORT||6000

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });


const server =app.listen(port,()=>{
    console.log("server starting in port no:",port);
})

//unhendle promise rejection
process.on('unhandledRejection',(err) =>{
    console.log(`Error ${err.message}`);
    console.log('shutting down the server due to unhandler promise rejection');

    server.close(()=>
    process.exit(1))
})