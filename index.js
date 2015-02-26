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

    client.on('send', function(data){
        io.emit('message', {message: data.message, user: user.name, c: data.c });
    });

    client.on('hello', function(data){
        client.emit('message', {welcome: '<i>--- ' + data.name + ', welcome to chat! ---</i>'});
        client.broadcast.emit('message', {welcome: '<i>--- ' + data.name + ' in chat now! ---</i>' });

        user.id = client.id;
        user.name = data.name;
        user.color = data.c;
        users.push(user);
        client.broadcast.emit('newuser', users);
        client.emit('newuser', users);

        console.log(users);
        console.log('=========================================================================');
    });

    client.on('disconnect', function() {
        var index = users.indexOf(user);
        users.splice(index,1);
        client.broadcast.emit('message', {welcome: '<i>... ' + user.name + ' has left the chat ...</i>' });
        client.broadcast.emit('removeuser', users);
    });
});
