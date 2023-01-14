require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const { dnsEncode } = require('ethers/lib/utils');
const dns = require('node:dns');

var array =[]
var controller

// Basic Configuration
const port =  3000;
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:shortened", function(req, res){
  let shorturl = req.params.shortened
  console.log(shorturl)
  if(shorturl.startsWith("https://")){
    res.redirect(array[shorturl])
  }
  else{
    res.redirect("https://"+array[shorturl])
  }
})
app.post("/api/shorturl", function(req, res, next){
  // console.log("this worked")
  // console.log(req.body.url)
  dns.lookup(req.body.url,(err,address, family)=>{
    if(err||req.body.url==""){
      res.json({error:"Invalid URL"})
    }
    else{
      controller = req.body.url
      console.log(address, family)
      next()
    }
  })
}, 
function(req, res){
  array.push(controller)
  console.log(array)
  res.json({original_url:controller, short_url:array.indexOf(controller)})

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
