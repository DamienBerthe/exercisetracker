const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let arr =[]
let arr2 = []
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
class user{
  constructor(username, id){
    this.username = username
    this._id = id
    this.log = []
    this.count = 0
  }
}

class exercise{
  constructor(description, duration, date){
    this.description = description
    this.duration = duration
    this.date = date
  }
}
app.post('/api/users', (req, res) => {

  let user1 = new user(req.body.username, crypto.randomBytes(12).toString('hex'))
  arr.push(user1)
  arr2.push(
    {
      _id: user1._id,
      username: user1.username
    }
  )
  res.json({
    _id: user1._id,
    username: user1.username
  })
  //res.json(user1)
  
  // let username = {username:req.body.username, _id:id}
  // arr.push(username)
  // res.json(username)
})

app.get('/api/users', (req, res) =>{
  res.send(arr2)
})

app.post('/api/users/:id/exercises', (req, res) =>{
  let currentUser = arr.find(obj => {
    return obj._id === req.params.id
  })
  let date = new Date(req.body.date)
  let correctDate = isValidDate(date) === true ? date : new Date()
  let exercise1 = new exercise(req.body.description, parseInt(req.body.duration),correctDate.toDateString())
  currentUser.log.push(exercise1)
  currentUser.count++
  res.json(
    {
      _id: req.params.id,
      username: currentUser.username,
      description: exercise1.description,
      duration: exercise1.duration,
      date: exercise1.date,
    }
  )
  //res.json({_id: req.params.id, username:name, date:correctDate.toDateString(), duration:parseInt(req.body.duration), description:req.body.description})
})

app.get('/api/users/:id/logs', (req, res) =>{
  let currentUser =  arr.find(obj =>{
    return obj._id === req.params.id
  })
  let filteredLog = currentUser.log
  if(req.query.from){
    let from = new Date(req.query.from)
    filteredLog = filteredLog.filter(obj => new Date(obj.date) >= from)
  }
  if(req.query.to){
    let to = new Date(req.query.to)
    filteredLog = filteredLog.filter(obj => new Date(obj.date) <= to)
  }
  if(req.query.limit){
    let limit = parseInt(req.query.limit)
    if(limit <= filteredLog.length){
      filteredLog = filteredLog.slice(filteredLog.length-limit)
    }
  }
  
  // console.log(new Date(currentUser.log[0].date))
  // console.log(from)
  // console.log(new Date(currentUser.log[0].date) > from)
   res.send({
    id_: currentUser._id,
    username: currentUser.username,
    count: currentUser.count,
    log: filteredLog
   }
  )
    // .log.filter(obj =>{
    //   return obj.date >= req.query.from && obj.date <= req.query.to
    // })

  // res.send(arr.find(obj =>{
  //   return obj._id === req.params.id
  // }))
  })

app.listen(10000)
