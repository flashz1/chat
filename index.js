var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));
var users = [];

app.use("/css", express.static(__dirname + '/css'));
app.use("/", express.static(__dirname));

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    res.render('tpl/page');
});

io.on('connection', function(client){
    var user = {};
    client.emit('welcome', {message: 'Welcome to chat!'});

    client.on('send', function(data){
        io.emit('message', {message: data.message, user: user.name });
    });

    client.on('hello', function(data){
        client.emit('welcome', {message: '--- Welcome ' + data.name + ' ---'});
        client.broadcast.emit('welcome', {message: '---' + data.name + ' in chat now! --- ' });

        user.id = client.id;
        user.name = data.name;
        users.push(user);
        client.broadcast.emit('newuser', users);
        client.emit('newuser', users);
    });

    client.on('disconnect', function() {
        var index = users.indexOf(user);
        users.splice(index,1);
        client.broadcast.emit('message', {message: '... ' + user.name + ' has left the chat ...' });
        client.broadcast.emit('removeuser', users);
    });
});
