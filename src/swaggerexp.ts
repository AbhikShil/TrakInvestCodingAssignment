const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const amqp = require('amqplib/callback_api');
const prompt = require('prompt-sync')();
const { Client } = require('pg');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ["swaggerexp.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
const client=new Client({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:"abhik@123",
  database:"company"
})

client.connect();
let resu;
client.query(`Select * from employee_department`,(err,result)=>{
  if(!err){
    resu=result.rows;
  }
  else{
    throw err;
  }
  client.end();
})
/**
 * @swagger
 * /books:
 *   get:
 *     description: Get All Employee Details
 *     responses:
 *       200:
 *         description: Success
 *
 */
 app.get('/books', (re, res) => {
   res.send(resu);
 });

 /**
 * @swagger
 * /books:
 *   post:
 *     description: Get all books
 *     parameters:
 *      - name: title
 *        description: title of the book
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post('/books', (req, res) => {
  res.status(201).send();
});/**
 * @swagger
 * /books:
 *   post:
 *     description: Insert New Employee
 *     parameters:
 *      - ename: Employee Name
 *        department: Department Name
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post('/books', (req, res) => {
  res.status(201).send();
});
 app.listen(5000, () => console.log("listening on 5000"));
