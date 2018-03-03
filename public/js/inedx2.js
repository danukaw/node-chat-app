let socket = io();

socket.on('connect', function() {
    console.log('connection is established');
});

socket.on('disconnect', function(){
    console.log('disconneted from server');
});

socket.on('newMessage', function(msg){
    let li = $('<li></li>');
    li.text(`${msg.from} : ${msg.text}`);

    $('#messages').append(li);

    console.log(msg);
});

$('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMsg', {
        from : 'user',
        text : $('[name=message]').val()
    }, function(){

    });
});

