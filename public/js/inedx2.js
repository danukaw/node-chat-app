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

//newLocationMessage

socket.on('newLocationMessage', function(locationmsg){
    
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Location</a>');

    li.text(`${locationmsg.from} :`);
    a.attr('href', locationmsg.url);

    li.append(a);

    $('#messages').append(li);
})

$('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMsg', {
        from : 'user',
        text : $('[name=message]').val()
    }, function(){

    });
});

$('#user-location').on('click', function(e){
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((posision)=>{
        
        socket.emit('createlocationmsg', {
            latitude : posision.coords.latitude,
            longitude : posision.coords.longitude
        }, function(){
    
        });

    }, (error)=>{
        console.log('enable get the location')
    });
});

