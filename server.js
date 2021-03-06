//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require('express-session')
// const session = require('express-session')

//____________________
//Configuration
//____________________
require('dotenv').config()
const app = express ();
const db = mongoose.connection;


//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;
//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true}
);
// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
//___________________
//Middleware
//___________________
//use public folder for static assets
app.use(express.static('public'));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
app.use(
   session({
      secret: process.env.SECRET,
      resave: false,
      saveUnitialized: false,
   })
)
app.set('veiw engine', 'ejs')
//___________________
// Routes
//___________________
//localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });
//  const momblogSeed = require('./models/momblogSeed.js')
//
// const Momblog = require('./models/momblog.js')
//    Momblog.create(momblogSeed,
//       (err, allMomblogs) =>{
//          if (err){
//             console.log(err)
//          } else {
//             console.log(allMomblogs)
//          }
//          res.redirect('/momblog')
//       }
//    )

   const momblogController = require('./controllers/contMomblog.js')
   app.use('/momblog', momblogController)
   const userController = require('./controllers/usrController.js')
   app.use('/users', userController)
   const sessionsController = require('./controllers/sessController.js')
   app.use('/sessions', sessionsController)

   app.get('/', (req, res)=>{
      res.redirect('/momblog')
   })


// app.get('/', (req, res)=>{
//    res.send('hello world')
// })

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
