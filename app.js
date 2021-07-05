const express = require('express')
const { Client } = require('pg')
const bodyParser = require('body-parser')
const connectionString = 'postgres://boss:boss@007@localhost:5432/bossdb'
const client = new Client({
  connectionString: connectionString
})
client.connect()
var result = []
let email
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/home', (req, res) => {
  if (email === undefined) {
    res.send({ login: ['please login'] })
  }
  client.query('Select * from login where email LIKE ($1)', [email], (err, result) => {
    if (err) {
      return console.error('error running query', err)
    }
    console.log(result.rows)
    res.send({ login: result.rows })
  })
})
app.post('/register', (req, res) => {
  client.query('INSERT INTO login (username,name,email,password,address,phone) values ($1,$2,$3,$4,$5,$6) ',
    [req.body.username, req.body.name, req.body.email, req.body.password, req.body.address, req.body.phone], (err, res) => {
      if (err) {
        res.status(500).send(err.toString())
      }
    })
})
app.post('/login', (req, res) => {
  email = req.body.email
  client.query('Select * from login where email LIKE ($1) and password LIKE ($2)', [req.body.email, req.body.password], (err, res) => {
    if (err) {
      res.status(500).send(err.toString())
    } else {
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
app.listen('3000')
console.log('app running on port 3000')
