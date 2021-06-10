const amqp = require('amqplib/callback_api');
const prompt = require('prompt-sync')();
const { Client } = require('pg');

class Subscriber {
  constructor() {
  }
  get(req,eid=0,ename="",dname=""){
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
          case 3://Select Entire Table
            console.log("Company Details:");
            client.query(`Select * from employee_department`,(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          case 4://Select Department
            console.log("Department Details:");
            client.query(`Select Distinct department from employee_department`,(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          case 5://Select Row Using eid
            eid=prompt('Enter Employee Id:');
            console.log("Employee Details:");
            client.query(`Select * from employee_department where e_id=$1`,[eid],(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          case 6://Select Employee Of Same Department
            dname=prompt('Enter Department Name:');
            client.query(`Select * from employee_department where department=$1`,[dname],(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
          case 7://Number Of Employees
            console.log("Number Of Employee In Each Department:");
            client.query(`Select department,count(e_id) from employee_department Group By department`,(err,result)=>{
              if(!err){
                console.log(result.rows);
              }
              else{
                throw err;
              }
              client.end();
            })
            break;
        case 8://Print The Queue
          console.log("Rabbitmq Queue Contents:");
          channel.assertQueue(queue,{
            durable: false
          });
          channel.consume(queue,(msg)=>{
            console.log(`Recieved: ${msg.content.toString()}`);
            channel.ack(msg);
          });
            break;
        default:
            console.log("Invalid Input! Try Again!");
            break;
        }
        setTimeout(() => {
          connection.close();
        }, 1000);
      })
    })
  }
}
module.exports= Subscriber;
