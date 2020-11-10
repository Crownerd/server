const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var multer_parser = multer({ storage: storage })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer_parser.any())

app.use(express.static("public"));

app.get("/", (request, response) => { response.sendFile(__dirname + "/views/index.html") });

app.post("/api/minigolf/replay", function(req, res) {
  console.log("Incoming request")
  fs.writeFile(__dirname + "/public/" + req.body.filename, JSON.stringify( req.body.body ), err => !!err ? () => { throw err } : null );
  res.sendStatus(200)
  setTimeout(() => { require("child_process").exec("refresh") }, 10);
});

const listener = app.listen(process.env.PORT, () => { console.log("Your app is listening on port " + listener.address().port) });