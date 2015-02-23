window.onload = function(){
    var socket = io.connect();
    var field = document.getElementById('field') ;
    var form = document.getElementById('form') ;
    var chatWindow = document.getElementById('chat-window') ;
    var users = document.getElementById('users') ;
    var name = prompt('Ваше имя?');

    socket.emit('hello', {'name': name});

    form.onsubmit = function(){
        var text = field.value;
        socket.emit('send', {'message': text});
        return false;
    };

    var messages = [];

    socket.on('message', function(data){
        if(data.message){
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++){
                html+= messages[i] + '<br>';
            }
            chatWindow.innerHTML = html;
        }else{
            console.log('Something wrong');
        }
    });

    //socket.on('showUsers', function(data){
    //    socket.emit('renderUsers', data);
    //});
};