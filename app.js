const express = require('express')
const { Client } = require('pg')
const bodyParser = require('body-parser')
const connectionString = 'postgres://postgres:@Shyam02@localhost:5432'
const client = new Client({
  connectionString: connectionString
})
client.connect()
var result = []
var output = []
var profile = []
let email
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
  res.render('register')
})
app.get('/', (req, res) => {
  res.render('register')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/home', (req, res) => {
  if (email === undefined) {
    console.log('nodata')
    res.render('notLogedIn', { login: 'please login' })
  }
  client.query('Select * from login where email LIKE ($1)', [email], (err, result) => {
    if (err) {
      return console.error('error running query', err)
    }
    res.render('home', { login: result.rows })
  })
})
app.post('/register', (req, res) => {
  client.query('Select * from login where email LIKE ($1) and password LIKE ($2)', [req.body.email, req.body.password], (err, res) => {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      if (res.rows.length !== 0) {
        console.log('data found')
        output.push('success')
      }
    }
  })
  setTimeout(() => {
    if (req.body.password === req.body.confirmPassword && output[output.length - 1] !== 'success') {
      client.query('INSERT INTO login (name,email,password) values ($1,$2,$3) ', [req.body.name, req.body.email, req.body.password], (err, res) => {
        if (err) {
          res.status(500).send(err.toString())
        } else {
          console.log('password matched')
        }
      })
      res.redirect('/login')
    } else {
      res.redirect('/')
      console.log('password doesnot matched or data already exist')
    }
  }, 1000)
})
app.post('/login', (req, res) => {
  email = req.body.email
  client.query('Select * from login where email LIKE ($1) and password LIKE ($2)', [req.body.email, req.body.password], (err, res) => {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      console.log(res.rows)
      profile.push(res.rows)
      if (res.rows.length === 0) {
        console.log('data not found')
      } else {
        console.log('email and password found')
        result.push('success')
      }
    }
  })
  setTimeout(() => {
    if (result[result.length - 1] === 'success') {
      res.redirect('/home')
    } else {
      res.redirect('/')
    }
  }, 1000)
})
app.post('/logout', (req, res) => {
  email = undefined
  res.redirect('/login')
})
app.listen('8080')
console.log('app running on port 8080')
