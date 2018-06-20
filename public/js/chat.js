let socket = io();

function scrollBottom() {
    console.log('inside scrollBottom');
    let messages;
    let clientHeight;
    let scrolTop;
    let scrollHeight;
    let newMessage;
    let lastMessageHeight;
    let newMessageHeight;

    messages = jQuery('#messages');
    newMessage = messages.children('li:last-child');
    clientHeight = messages.prop('clientHeight');
    scrolTop = messages.prop('scrollTop');
    scrollHeight = messages.prop('scrollHeight');
    newMessageHeight = newMessage.innerHeight();
    lastMessageHeight = newMessage.prev().innerHeight();
    
    if(clientHeight + scrolTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log("should scroll");
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', function() {
    console.log('connection is established');
    let param = jQuery.deparam(window.location.search);
    socket.emit('join', param, function(err){
       if (err) {
        alert(err);
        window.location.href='/';
       } else {

       }
    });
});

socket.on('updateUserlist', function(users) {
    console.log('Users', users);
    let ol = jQuery('<ol></ol>');
    
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('disconnect', function(){
    console.log('disconneted from server');
});

socket.on('newMessage', function(msg){
    let formatedTime = moment(msg.createdAt).format("h:mm a");
    /*let li = $('<li></li>');
    li.text(`${msg.from}, ${formatedTime} : ${msg.text}`);

    $('#messages').append(li);*/
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text : msg.text,
        from : msg.from,
        time : formatedTime

    });
    $('#messages').append(html);
    scrollBottom();
    console.log(msg);
});

//newLocationMessage

socket.on('newLocationMessage', function(locationmsg){
    let formatedTime = moment(locationmsg.createdAt).format("h:mm a");
    let template = $('#location-template').html();

    let html = Mustache.render(template, {
        from : locationmsg.from,
        time : formatedTime,
        link : locationmsg.url
    });
    $('#messages').append(html);
    /*let li = $('<li></li>');
    let a = $('<a target="_blank">My Location</a>');

    li.text(`${locationmsg.from}, ${formatedTime}: `);
    a.attr('href', locationmsg.url);

    li.append(a);

    $('#messages').append(li);*/
    scrollBottom();
})

$('#message-form').on('submit', function(e){
    e.preventDefault();
    let sendMessage = $('[name=message]');
    console.log(sendMessage);
    socket.emit('createMsg', {
        text : sendMessage.val()
    }, function(ack){
        sendMessage.val('');
        console.log(ack)
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

