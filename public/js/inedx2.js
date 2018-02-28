let socket = io();

socket.on('connect', function() {
    console.log('connection is established');
    socket.emit('createMsg',{
        from : 'Danuka',
        text : 'What are you doing'
    });
});

socket.on('disconnect', function(){
    console.log('disconneted from server');
});

socket.on('createMsg', function(msg){
    console.log(msg)
    
});

socket.on('newMessage', function(msg){
    console.log(msg);
});

