var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(80));

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    res.render('tpl/page');
});

var users = {};
function getUsers(obj){
    var tmp = [];
    for (var i in obj){
        tmp.push(obj[i]);
    }
    return tmp.join(', ');
}


io.on('connection', function(client){
    client.emit('message', {'message': 'Welcome to chat!'});

    client.on('send', function(data){
        io.emit('message', {'message': data.message});
    });

    client.on('hello', function(data){
        client.emit('message', {message: '--- Welcome ' + data.name});
        client.broadcast.emit('message', {message: data.name + ' --- зашел ' });


        if(Object.keys(users).length > 0){
            var userList = getUsers(users);
            client.emit('message', {message: 'Уже в чате: ' + userList + ' ----'});
        }else{
            client.emit('message', {message: 'Кроме Вас никого нет'});
        }
        users[client.id] = data.name;
    });
});
