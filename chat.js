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
    var radios = document.getElementsByName('color');
    var colorMsg;
    checkColor(radios);
    socket.emit('hello', { name: name, c: colorMsg });

    form.onsubmit = function(){
        var text = field.value;
        checkColor(radios);
        socket.emit('send', { message: text, c: colorMsg });
        field.value = '';
        return false;
    };

    socket.on('message', function(data){
        var html = '';
        if(data.message){
            html+= '<strong>' + startTime() + ': ' + data.user + ':</strong>  ' + '<span style="color:'+ data.c +'">' + data.message + '</span><br>';
            chatWindow.innerHTML += html;
            chatWindow.scrollTop = chatWindow.scrollHeight;
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

    function checkColor(radios){
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                colorMsg = radios[i].value;
                break;
            }
        }
    }

};