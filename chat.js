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
    var user = [];
    var colors = {
        c : 1
    };

    socket.emit('hello', {'name': name});

    form.onsubmit = function(){
        var radios = document.getElementsByName('color');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                var color = radios[i].value;
                colors.c = color;
                break;
            }
        }
        var text = field.value;
        socket.emit('send', {'message': text});
        field.value = '';
        return false;
    };

    socket.on('message', function(data){
        chatWindow.scrollTop = chatWindow.scrollHeight;
        var html = '';
        if(data.message){
            html+= '<strong>' + startTime() + ': ' + data.user + ':</strong>  ' + '<span style="color:'+ colors.c +'">' + data.message + '</span><br>';
            chatWindow.innerHTML += html;
        }else if(data.welcome){
            html+= data.welcome + '<br>';
            chatWindow.innerHTML += html;
        }else{
            console.log('Something wrong');
        }
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

};