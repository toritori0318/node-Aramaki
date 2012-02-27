var socket = io.connect('http://localhost:3000');
var fileName;
var finish;

function place(fileName){
    fig = "<a href='#' onclick='onClick()'>"
    + "<img src='images/"+ fileName +".gif'></a>";
    document.getElementById("pan").innerHTML = fig;
}
socket.on('key', function(key) {
    console.log(key.value);
    switch (key.value) {
        case 1:
            fileName = 'armk2';
            place(fileName);
            break;
        case 2:
            fileName = '2';
            place(fileName);
            break;
        case 3:
            fileName = '3';
            place(fileName);
            break;
        case 4:
            fileName = '4';
            place(fileName);
            break;
        case 5:
            fileName = '5';
            place(fileName);
            break;
        case 6:
            fileName = '6';
            place(fileName);
            break;
        case 7:
            fileName = '7';
            place(fileName);
            break;
        default:
            break;
    }
});

function onClick() {
    if(finish) return;

    quakeimage();
    console.log('click');
    socket.emit('click', { name : name });
}

socket.on('click', function(click) {
    console.log(click.damage);
    quakeimage();
    appendMessage(click);
});
function appendMessage(click){
    var elm =$('div#chat-box');
    var message = click.name + 'が' + click.damage + 'のダメージを与えた！';
    //elm.append('<div class="msg">' + message + '</div>'); 
    elm.prepend('<div class="msg"><p>' + message + '</p></div>'); 
}

socket.on('finish', function(click) {
    finish = true;
    console.log('finish');
    var user = click.user;
    var elm =$('div#finish-box');
    var message = '[荒巻を目覚めさせた！] '+ user +'が止めをさしました';
    elm.append('<div class="msg"><p>' + message + '</p></div>'); 
});


