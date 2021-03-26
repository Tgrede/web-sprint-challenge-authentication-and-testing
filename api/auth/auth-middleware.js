const Users = require("./auth-model")

const checkUsernameExists = async (req, res, next) => {
  try{
    let usernameToCheck = req.body.username
    const allUsers = await Users.find()

    const foundUser = allUsers.filter(user => {
      return usernameToCheck === user.username
    })
    if(foundUser.length === 0){
      res.status(422).json({message: "invalid credentials"})
    } else {
      next()
    }
  }catch(err){
    next(err)
  }
}

async function checkUsernameFree(req, res, next) {
  try{
    let usernameToCheck = req.body.username
    const allUsers = await Users.find()

    const foundUser = allUsers.filter(user => {
      return usernameToCheck === user.username
    })
    if(foundUser.length === 0){
      next()
    } else {
      res.status(422).json({message: "Username taken"})
    }
  }catch(err){
    next(err)
  }
}

function checkBodyExists(req, res, next) {
  const body = req.body
  if(!body || !body.username || !body.password) {
    res.status(422).json({message: "username and password required"})
  } else {
    next()
  }
}

module.exports = {
  checkUsernameExists,
  checkUsernameFree, 
  checkBodyExists
}