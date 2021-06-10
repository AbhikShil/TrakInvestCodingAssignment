const Publisher = require('./publisher.ts');
const Subscriber = require('./subscriber.ts');
const prompt = require('prompt-sync')();
const log4js=require('log4js');
log4js.configure({
  appenders: {fileAppender:{type:'file', filename: './logs/mylog.txt'}},
  categories: {default:{appenders:['fileAppender'],level: 'info'}}
});
const logger =log4js.getLogger();
var today=new Date();
var date=today.getFullYear()+'-'+(today.getMonth()-1)+'-'+today.getDate()+' at '+today.getHours()+':'+today.getMinutes();
logger.info(`Application Was Run On: ${date}`)

let publisher = new Publisher();
let subscriber = new Subscriber();

console.log("Welcome To Our Company Database");
console.log("What Would You Like To Do:");
console.log("\n1.Insert/Post Data To Company Database\n2.Delete Data From Company Database\n3.Display Entire Company Database\n4.Display Department Details\n5.Display Specific Employee Detail\n6.Filter Employees Based On Department\n7.Display Number Of Employees In Each Department\n8.Display The Rabbitmq Queue\n");
let req=prompt('Enter Your Choice:');
console.log(`Choice: ${req}`);
let emp,dep,edid;
switch (Number(req)) {
  case 1:
  case 2:
    publisher.post(req);
    break;
  case 3:
  case 4:
  case 5:
  case 6:
  case 7:
  case 8:
    subscriber.get(req);
    break;
  default:
    console.log("Invalid Input");
}
