const express = require("express");
const querystring = require("querystring");
const cors = require("cors");
const generate = require("./util/randomString");
const request = require("request");
const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

var client_id = "8e9ed7adc9bd4ed2b981197b8a7029c9";
var client_secret = "9bcc940d0001494186f823b34f0a6345";
var redirect_uri = "https://spotify-home.herokuapp.com/callback";

app.get("/login", (req, res) => {
  var state = generate();
  var scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;
        res.redirect(
          `https://ammyy9908.github.io/?access_token=${access_token}&refresh_token=${refresh_token}`
        );
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
