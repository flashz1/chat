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
    var name = prompt('Ваше имя?');
    var welcomeMessages = [];
    var user = [];

    socket.emit('hello', {'name': name});

    form.onsubmit = function(){
        var text = field.value;
        socket.emit('send', {'message': text});
        field.value = '';
        return false;
    };

    socket.on('message', function(data){
        if(data.message){
            var html = '';
                html+= data.user + ': ' + data.message + '<br>';
            chatWindow.innerHTML += html;
        }else{
            console.log('Something wrong');
        }
    });

    socket.on('welcome', function(data){
        if(data.message){
            welcomeMessages.push(data.message);
            var html = '';
            for(var i=0; i<welcomeMessages.length; i++){
                html+= welcomeMessages[i] + '<br>';
            }
            chatWindow.innerHTML = html;
        }else{
            console.log('Something wrong');
        }
    });

    socket.on('newuser', function(data){
        rebuildUserList(data);
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
};