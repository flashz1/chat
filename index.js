var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(8080));
var users = [];
var messages = [];

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
        messages.push('<strong>' + startTime() + ': ' + user.name + ':</strong>  ' + '<span style="color:'+ data.color +'">' + data.message + '</span>');
        setTimeout(function(){
            messages.shift();
        }, 30000);
        io.emit('message', {message: data.message, user: user.name, color: data.color, time: startTime() });
    });

    client.on('hello', function(data){
        client.emit('message', {welcome: '<i>--- ' + data.name + ', Bem-Vindo ao Chat! ---</i>'});
        client.broadcast.emit('message', {welcome: '<i>--- ' + data.name + ' entrou na conversa! ---</i>' });

        user.id = client.id;
        user.name = data.name;
        user.color = data.color;
        users.push(user);
        client.broadcast.emit('newuser', users);
        client.emit('newuser', users);
        client.emit('showHistory', messages);
    });

    client.on('disconnect', function() {
        var index = users.indexOf(user);
        users.splice(index,1);
        client.broadcast.emit('message', {welcome: '<i>... ' + user.name + ' saiu da conversa...</i>' });
        client.broadcast.emit('removeuser', users);
    });

    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        m = checkTime(m);
        s = checkTime(s);
        return h + ":" + m + ":" + s;
    }
});
