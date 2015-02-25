var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));

app.use("/css", express.static(__dirname + '/css'));
app.use("/", express.static(__dirname));

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    res.render('tpl/page');
});

io.on('connection', function(client){
    var user = {};
    client.emit('message', {message: 'Welcome to chat!'});

    client.on('send', function(data){
        io.emit('message', {message: data.message });
    });

    client.on('hello', function(data){
        client.emit('message', {message: '--- Welcome ' + data.name + ' ---'});
        client.broadcast.emit('message', {message: '---' + data.name + ' in chat now! --- ' });

        user.id = client.id;
        user.name = data.name;
    });

    client.emit('newuser', user);

    client.on('disconnect', function() {
        client.broadcast.emit('removeuser', user);
    });
});
