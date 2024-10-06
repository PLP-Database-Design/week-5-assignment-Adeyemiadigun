// import some dependencies
const express=require('express')
// http framewprk for handling requests
// instance of express framework
const app=express();
// dbms mysql
const mysql=require('mysql2')
//cross origin resourece sharing
const cors=require('cors')
//environment variable doc
const dotenv=require('dotenv')

app.use(express.json())
app.use(cors())
dotenv.config();

// connection to the database
const db =mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// check if there's connection
db.connect((err)=>{
  //if no connection 
  if (err) return console.log("Error connecting to MYSQL");
  // if connection works 
  console.log("connected to MYSQL a id: ", db.threadId);

})

// YOUR code goes down here

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Data.ejs is in views folder
// your code goes up there
app.get('/data', (req, res) => {
  // First query
  db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, result1) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error Retrieving data');
      }

    

      // Second query after first one succeeds
      db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, result2) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error Retrieving data');
          }

          db.query("SELECT * FROM patients WHERE first_name = 'John' ", (err, result3) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error Retrieving data');
            }
            db.query("SELECT * FROM providers WHERE provider_specialty = 'Cardiology'", (err, result4) => {
              if (err) {
                  console.error(err);
                  return res.status(500).send('Error Retrieving data');
              }

          // Combine both query results and render EJS
          res.render('data', { results1: result1, results2: result2, results3:result3, results4:result4  });
      });
  });
});
});
});




// start the server 
app.listen(process.env.port,()=>{
console.log(`server listening on port ${ process.env.PORT}`);
// sending message to the browser 
console.log('sending message to browser')
app.get('/',(req,res)=>{
  res.send('Server started successfully');
});
})