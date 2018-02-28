$(function(){
    
    let socket = io();
    
    $('form').submit(()=>{
        socket.emit('chat message', $('#m').val())
        $('#m').val('');
        return false;
    });

    socket.on('connect', ()=>{
    console.log('connected to server');
    });

    socket.on('disconnect', ()=>{
        console.log('disconnected from server');
    });

    socket.on('chat message', (msg)=>{
        $('#messages').append($('<li>').text(msg));
    });
}
);