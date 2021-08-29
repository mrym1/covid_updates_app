const http = require("http");
const path = require('path');
const express = require('express');
const app = express();
const request = require("request");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates");

app.set("view engine", "ejs");

app.use(express.static(static_path));
app.set("views",templates_path);

app.get("/", (req, res) => {
  let country = "";
  request(`https://corona.lmao.ninja/v2/countries/`, (err, resp) => {
      if (err) {
          res.status(404).render('404', {
              err: "Country Not Found"
          });
      } else {
          let API_Country = JSON.parse(resp.body);
          country = API_Country;
      }
      res.render("index", {
          country1: country
      });
  });
});

app.post("/", (req, res) => {
  let covid = "";
  request(`https://corona.lmao.ninja/v2/countries/${req.body.country}`, (err, resp) => {
      if (err) {
          res.status(404).render('error', {
              err: "Server Error"
          });
      } else {
          let API_Covid = JSON.parse(resp.body);
          covid = API_Covid;
          if (covid.message != undefined) {
              res.status(404).render('error', {
                  err: "Country Not Found"
              });
          } else {
              res.render("covid", {
                  covid1: covid,
              });
          }
      }
  });
})


app.listen(port, () => {
    console.log(`Server running at ${port}`);
  });