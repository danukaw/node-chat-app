const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {User} = require('./utils/users');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let publicPath = path.join(__dirname, '../public');
let user = new User();

let PORT = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.use((req,res, next)=> {
    if (req.headers['x-forwarded-proto'] === 'https') {
        
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});



io.on('connection', (socket)=>{
    
    console.log('new user connected');

    socket.on('join',(param, callback) => {
        
        if(!isRealString(param.name) || !isRealString(param.room)){
            return callback('name and room is required');
        } else {
            callback();
        }
        socket.join(param.room);
        //  add user to list
        user.addUser(socket.id, param.name, param.room);
        // emit to all users within the room        
        io.to(param.room).emit('updateUserlist', user.getUserList(param.room));


        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin', `${param.name} joined`));

    });

    socket.on('createMsg', (msg,callback) => {
        console.log('createMsg : ', msg);
        var usrObj = user.getUser(socket.id);
        if(usrObj && isRealString(msg.text)) {
           io.to(usrObj.room).emit('updateUserlist', user.getUserList(usrObj.room));
           io.to(usrObj.room).emit('newMessage', generateMessage(usrObj.name, msg.text));
        }
        callback('this is from server');
    });

    socket.on('createlocationmsg', (coords, callback) => {
        console.log('createlocationmsg : ', coords);
        var usrObj = user.getUser(socket.id);

        if(usrObj) {
            io.to(usrObj.room).emit('updateUserlist', user.getUserList(usrObj.room));            
            io.to(usrObj.room).emit('newLocationMessage', generateLocationMessage(usrObj.name, coords.latitude, coords.longitude)); 
        }

        callback();       
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from server');
        let removedUser = user.removeUser(socket.id);
        
        io.to(removedUser.room).emit('updateUserlist', user.getUserList(removedUser.room));
        io.to(removedUser.room).emit('newMessage', generateMessage('Admin', ` ${removedUser.name} has left the chat`));
    });

});

server.listen(PORT, ()=> {
    console.log(`server has start at port ${PORT}`)
})