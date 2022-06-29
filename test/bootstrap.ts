import "mocha";
import * as fs from "fs";
var Sails = require("./fixture/node_modules/sails").Sails;
require("dotenv").config();

process.env.BASE_ROUTE = "/admin";
process.env.HTTP_TEST_LOCALHOST = "http://127.0.0.1:42772";

let sails: any

before(function (done) {

  this.timeout(50000);
  require("./fixture/app-export");
  Sails().lift({},
      function (err: any, _sails: any) {
        if (err) return done(err);
        sails = _sails;
        return done();
      }
  );
});

after(function (done) {
  if (sails) {
    return sails.lower(function (err: any) {
      if (err) {
        done();
      }
      done();
    });
  }
  done();
});
