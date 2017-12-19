/**
 * Created by espen on 19-Dec-17.
 */
var express = require('express');
var http = express();

http.use(express.static("./www"));
http.use("/bower_components", express.static("./bower_components"));
console.log("Starting dev server on port 1337");
http.listen(1337);