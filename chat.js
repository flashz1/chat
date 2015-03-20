var socket;
window.onunload = function(){
    socket.disconnect();
};
window.onload = function(){
    var socket = io.connect();
    var field = document.getElementById('field');
    var form = document.getElementById('form');
    var chatWindow = document.getElementById('chat-window');
    var usersList = document.getElementById('user-list');
    var name = prompt('Qual é o seu nome?');
    var radios = document.getElementsByName('color');
    var colorMsg;
    checkColor(radios);
    socket.emit('hello', { name: name, color: colorMsg });

    form.onsubmit = function(){
        var text = field.value;
        checkColor(radios);
        socket.emit('send', { message: text, color: colorMsg });
        field.value = '';
        return false;
    };

    socket.on('message', function(data){
        var html = '';
        if(data.message){
            html+= '<strong>' + data.time + ': ' + data.user + ' diz:</strong>  ' + '<span style="color:'+ data.color +'">' + data.message + '</span><br>';
            chatWindow.innerHTML += html;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }else if(data.welcome){
            html+= data.welcome + '<br>';
            chatWindow.innerHTML += html;
        }else{
            console.log('Something wrong');
        }
    });

    socket.on('showHistory', function(messages){
        var html = '';
        for(var i=0; i<messages.length; i++){
            html+= messages[i] + '<br>';
        }
        chatWindow.innerHTML += html;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    socket.on('newuser', function(users){
        rebuildUserList(users);
    });

    socket.on('removeuser', function(users){
        rebuildUserList(users);
    });

    function rebuildUserList(users){
        var html = '';
        for(var i=0; i<users.length; i++){
            html+= '<li>' + users[i].name + '</li>';
        }
        usersList.innerHTML = html;
    }

    function checkColor(radios){
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                colorMsg = radios[i].value;
                break;
            }
        }
    }

};