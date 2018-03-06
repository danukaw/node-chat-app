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
    let sendMessage = $('[name=message]');
    socket.emit('createMsg', {
        from : 'user',
        text : sendMessage.val()
    }, function(){
        sendMessage.val('');
    });
});

$('#user-location').on('click', function(e){
    e.preventDefault();
    
    let userLocation = $('#user-location');

    if(!navigator.geolocation){
        return alert('Unfortunately geolocation is not supported...');
    }

    userLocation.attr('disabled','disabled').text('Seding location...');

    navigator.geolocation.getCurrentPosition((posision)=>{
        
        socket.emit('createlocationmsg', {
            latitude : posision.coords.latitude,
            longitude : posision.coords.longitude
        }, function(){
            userLocation.removeAttr('disabled').text('Send location');            
        });

    }, (error)=>{
        console.log('enable get the location')
        userLocation.removeAttr('disabled').text('Send location');        
    });
});

