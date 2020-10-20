const express = require("express");
const app = express();
const http =  require("http").createServer(app);

// faster io feedback https://stackoverflow.com/a/49013077/1446598
// const io = require("socket.io")(http, { wsEngine: 'ws' });
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

http.listen(3000, function() {
    console.log("http://locahost:3000");
});

// create new board instance
const five = require("johnny-five");
const arduino = new five.Board();

arduino.on('ready', function(){
    var joystick = new five.Joystick({
        pins: ["A0", "A1"],
        invertY: true 
    });

    // emit joystick values, * 100, to limit floating-point operations
    joystick.on("change", function(){
        console.log("Joystick values * 100");
        console.log("x: ", this.x * 100);
        console.log("y: ", this.y * 100);
        io.sockets.emit('joystick', { x: this.x * 100, y: this.y * 100 });
    });
});
