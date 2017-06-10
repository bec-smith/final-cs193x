const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

let db = null;
async function main() {
  const DATABASE_NAME = 'cs193x-db';
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
};

main();



////////////////////////////////////////////////////////////////////////////////

//gets dog info
async function onGetDogs(req, res) {
  const response = await fetch('https://becnichelesmith.github.io/cs193x-dog-adoption/adoptable.json');
  const json = await response.json();
  res.json(json);
}
app.get('/dogs', onGetDogs);

//saves selected dogs and email address of user
async function onSaveDogs(req, res) {
  const email = req.body.email;
  const dogs = req.body.dogs;

  const query = {
    email: email
  };
  const newEntry = {
    email: email,
    dogs: dogs
  };
  const params = {
    upsert: true
  };
  const collection = db.collection('dogs');
  const response = await collection.update(query, newEntry, params);

  res.json({ successID: response });
}
app.post('/save', jsonParser, onSaveDogs);

//sends email to user

async function onSendEmail(req, res) {
  const email = req.body.userEmail;
  const text = req.body.emailText;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: 'cs193x.dog.adoption@gmail.com',
      pass: 'dogadoption'
    }
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Dog Adoption!" <cs193x.dog.adoption@gmail.com>', // sender address
    to: email, //email input
    subject: 'Selected Dogs ✔', // Subject line
    text: text // plain text body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.json({message: 'error'});
    }else{
      console.log('Message sent: ' + info.response);
      res.json({message: info.response});
    };
  });
}
app.post('/mail', jsonParser, onSendEmail);
