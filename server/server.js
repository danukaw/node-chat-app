const express = require('express');
let app = express();

let PORT = process.PORT || 3000

app.use(express.static('../public'));

app.listen(PORT, ()=> {
    console.log(`server has start at port ${PORT}`)
})