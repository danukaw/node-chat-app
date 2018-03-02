let socket = io();

socket.on('connect', function() {
    console.log('connection is established');
});

socket.on('disconnect', function(){
    console.log('disconneted from server');
});

socket.on('newMessage', function(msg){
    console.log(msg);
});


