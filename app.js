const express = require('express'),
app = express(),
Path = require('path');

console.log(Path.resolve(`${__dirname}/docs`));

app.use(express.static(Path.resolve(`${__dirname}/docs`)));



app.listen(3000);
