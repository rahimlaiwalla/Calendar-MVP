//Proxy Server File

//pull in environment variables
require('dotenv').config();

const Twilio = require('twilio')
// const Chance = require('chance')
const express = require('express')

// const syncServiceDetails = require('./sync.js');

const app = express()

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

//Instantiate chance to generate random names
// const chance = new Chance()

//get route requests and returns a token from Twilio
app.get('/token/:id', function (req, res) {
  //create token object with account info to project
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  )
  //give the token an name (can use username of chatter, instead of random)
  token.identity = req.params.id;

  //add chat grant to token
  token.addGrant(new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  }))
  //return JSON object back to client
  res.send({
    identity: token.identity,
    token: token.toJwt()
  })
})

// syncServiceDetails();


//Since this is a proxy server, need a different port than the client app itself
app.listen(3001, function () {
  console.log('Programmable Chat token server listening on port 3001!')
})