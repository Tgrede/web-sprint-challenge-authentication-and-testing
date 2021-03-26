const router = require('express').Router();
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../secrets/index')
const bcryptjs = require('bcryptjs')
const Users = require('../auth/auth-model');
const { checkBodyExists, checkUsernameExists, checkUsernameFree } = require('./auth-middleware');

//eslint-disable-next-line
router.post('/register',checkBodyExists, checkUsernameFree, async (req, res, next) => {
  let credentials = req.body

  const hash = bcryptjs.hashSync(credentials.password, 8)

  credentials = {...credentials, password: hash}

  let newUser = await Users.add(credentials)
  newUser = await Users.findBy(credentials)
  
  res.status(201).json(newUser[0])

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkBodyExists, checkUsernameExists, async (req, res, next) => {

  try{
    let {username, password} = req.body


    const user = await Users.findBy({username: username}).first() 
    
    if(user && bcryptjs.compareSync(password, user.password)) {
      const token = buildToken(user)
      res.status(200).json({message: `welcome, ${user.username}`, token})
    } else {
      res.status(401).json({message: 'invalid credentials'})
    }
  } catch(err){
    next(err)
  }
  

  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const config = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, jwtSecret, config)
}

module.exports = router;
