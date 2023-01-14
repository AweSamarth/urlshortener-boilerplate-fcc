require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { dnsEncode } = require("ethers/lib/utils");

var array = [];
let regex =/(?<=(http|https|ftp):\/\/)[^\/]+/


// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post(
  "/api/shorturl/",
  function (req, res) {
      if (!regex.test(req.body.url)) {
        res.json({ error: "Invalid URL" });
      } else {

        
        array.push(req.body.url);
        console.log(array);
        res.json({
          original_url: req.body.url,
          short_url: parseInt(array.indexOf(req.body.url)),
        })
      }
    
  },
);
app.get("/api/shorturl/:shortindex", function (req, res) {
  let shortindex = req.params.shortindex;

  console.log(array[shortindex]);
  if (array[shortindex] != undefined) {
    if (array[shortindex].startsWith("https://")) {
      res.redirect(array[shortindex]);
    } else {
      res.redirect("https://" + array[shortindex]);
    }
  }
  else res.json({this:"this"})
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
