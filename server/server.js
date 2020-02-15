const Joi = require('@hapi/joi');
const config = require('./config/default')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const users = require('./routes/users');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const scraping = require('./routes/scraping');
const worker = require('./routes/worker');
const jwtp = config.jwtPrivateKey



if (!jwtp) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}
mongoose.connect('mongodb://localhost/parkcheat')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));
 
  

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/scraping', scraping);
app.use('/api/worker', worker);
app.get('/ping', (req, res) => {
    res.send("pong")
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
