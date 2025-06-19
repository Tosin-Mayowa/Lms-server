
require('dotenv').config({path:`config.env`});

const app=require('./index')

const {PORT}=process.env;
// REMOTE_CONN_STR

process.on('uncaughtException',(err)=>{
    console.log(err.name,err.message);
    console.log('uncaught exception error occur');
        console.log('shutting down..');
        process.exit(1);
    
    })

const server=app.listen(PORT || 8000,()=>{
    console.log('server running on port:'+ PORT);
    console.log(__filename);
})
process.on('unhandledRejection',(err)=>{
console.log(err.name,err.message);
console.log('unhandled Rejection promise exception error occur');

console.log('closing the server...');
server.close(()=>{
    console.log('shutting down..');
    process.exit(1);
})
})