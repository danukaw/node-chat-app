const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let publicPath = path.join(__dirname, '../public');

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

    socket.emit('newMessage', {
        from : "Admin",
        text : "Welcome to chat app"
    });

    socket.broadcast.emit('newMessage', {
        from : 'Admin',
        text : "New user joined"
    });

    socket.on('createMsg', (msg) => {
        console.log('createMsg : ', msg);
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        })
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from server');
    });

});

server.listen(PORT, ()=> {
    console.log(`server has start at port ${PORT}`)
})