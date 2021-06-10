const amqp = require('amqplib/callback_api');
const { Client } = require('pg');
const prompt = require('prompt-sync')();
const log4js=require('log4js');
log4js.configure({
  appenders: {fileAppender:{type:'file', filename: './logs/mylog.txt'}},
  categories: {default:{appenders:['fileAppender'],level: 'info'}}
});
const logger =log4js.getLogger();

class Publisher {
  constructor() {
  }
  post(req){
      const client=new Client({
        host:"localhost",
        port:5432,
        user:"postgres",
        password:"abhik@123",
        database:"company"
      })
      client.connect();
    amqp.connect(`amqp://localhost`,(err,connection)=>{
      if(err){
        throw err;
      }
      connection.createChannel((err,channel)=>{
        if(err){
          throw err;
        }
        let queue= "abhikQueue";
        switch (Number(req)) {
          case 1://Post Data
            let ename=prompt('Enter Employee Name:');
            let dname=prompt('Enter Department Name:');
            let message=`Inserted A New Row With Employee Name: ${ename} and Department: ${dname}`;
            logger.info(`${message}`);
            channel.assertQueue(queue,{
              durable: false
            });
            channel.sendToQueue(queue,Buffer.from(message));
            console.log(`Message: ${message}`)
            setTimeout(() => {
              connection.close();
            }, 1000);
            client.query(`insert into employee_department(ename,department) values($1,$2) RETURNING e_id`,[ename,dname],(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          case 2://Delete Data
            let eid=prompt('Enter Employee Id:');
            let me=`Deleted Row With Employee Id: ${eid}`;
            logger.info(`${me}`);
            channel.assertQueue(queue,{
              durable: false
            });
            channel.sendToQueue(queue,Buffer.from(me));
            console.log(`Message: ${me}`)
            setTimeout(() => {
              connection.close();
            }, 1000);
            client.query(`delete from employee_department where e_id=$1 RETURNING *`,[eid],(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          default:
            console.log("Invalid Input! Try Again!");
            break;
        }
      })
    })
  }
}
module.exports= Publisher;
