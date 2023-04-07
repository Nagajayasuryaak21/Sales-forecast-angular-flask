const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Routes to Handle Request
const userRoute = require('./routes/user.routes')
const User = require('./models/User')
// MongoDB Setup
mongoose
  .connect('mongodb+srv://surya123:surya123@cluster0.hdkirxr.mongodb.net/?retryWrites=true&w=majority')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

// Setup Express.js
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())

// Make Images "Uploads" Folder Publicly Available
app.use('/public', express.static('public'))

// API Route
app.use('/api', userRoute)

app.post('/register', async (req, res) => {
  const { username, password ,email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    email
  });
  user.save();
  res.json({
    message: 'User registered successfully'
  });
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({
      message: 'Invalid username or password'
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: 'Invalid username or password'
    });
  }
  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({
    message: 'Login successful',
    id: user._id,
    //token
  });
});

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Error
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error('Something went wrong'))
  })
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})


