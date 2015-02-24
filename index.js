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

function showUsersList(users){
    var tmp = [];
    return users.map(function(user){
        return user.name
    }).join(', ');
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
            client.emit('message', {message: 'Уже в чате: ' + showUsersList(users) + ' ----'});
        }else{
            client.emit('message', {message: 'Кроме Вас никого нет'});
        }
        var user = {id: client.id, name: data.name};
        users.push(user);
    });

    client.on('disconnect', function() {
        console.log('Отключился');
        client.broadcast.emit('message', {message: 'покинул чат' });
    });
});
