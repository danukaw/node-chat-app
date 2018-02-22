const path = require('path');
const express = require('express');
let app = express();
let publicPath = path.join(__dirname, '../public');

let PORT = process.PORT || 3000

app.use(express.static(publicPath));

app.use((req,res, next)=> {
    if (req.headers['x-forwarded-proto'] === 'https') {
        
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

app.listen(PORT, ()=> {
    console.log(`server has start at port ${PORT}`)
})