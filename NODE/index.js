const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mysql = require('mysql')
const db = mysql.createConnection({
  host: 'localhost',
  user: 'rootnew',
  password: '1234',
  database: 'sahildb'
})

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.message);
      return;
    }
  
    console.log('Connected to the database successfully');
  
    db.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
      if (err) throw err
  
      console.log('The solution is: ', rows[0].solution);
    });
  
    // connection.end((err) => {
    //   if (err) {
    //     console.error('Error closing the database connection: ' + err.message);
    //     return;
    //   }
  
    //   console.log('Connection closed successfully');
    // });
  });

app.get('/', (req, res) => {
    const query = 'SELECT Name, Roll_no, School FROM details';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving students: ' + err.message);
        return res.status(500).send('Error retrieving students.');
      }
      res.render('index', { students: results });
    });
  });

  app.get('/admin', (req, res) => {
    const query = 'SELECT Name, Roll_no, School FROM details';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving students: ' + err.message);
        return res.status(500).send('Error retrieving students.');
      }
      res.render('admin', { students: results });
    });
  });
  app.post('/add-student', (req, res) => {
    const { name, roll_no, school } = req.body;
    if (!name || !roll_no || !school) {
      return res.status(400).send('All fields (name, roll_no, school) are required.');
    }
  
    const query = 'INSERT INTO details (Name, Roll_no, School) VALUES (?, ?, ?)';
    db.query(query, [name, roll_no, school], (err, result) => {
      if (err) {
        console.error('Error adding student: ' + err.message);
        return res.status(500).send('Error adding student.');
      }
      res.redirect('/'); // Redirect back to the add-student form
    });
  });

app.get('/getStudents', (req, res) => {
    const query = 'SELECT Name, Roll_no, School FROM students';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving students: ' + err.message);
            return res.status(500).send('Error retrieving students.');
        }
        res.json(results);
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})