var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors')

const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chats');

mongoose.connect('mongodb://localhost/react-chat-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log(`Connected to database mongodb`))
    .catch((err) => console.error('Error'));

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chats');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use('/', indexRouter);
app.use('/api/chats', chatRouter);

module.exports = app;
