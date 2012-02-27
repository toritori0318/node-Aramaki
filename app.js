
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// mongodb
var db;
mongoose.connect('mongodb://localhost/aramakidb');
var Schema = mongoose.Schema;
var RoomSchema = new Schema({
  roomno: Number,
  max_hp: Number,
  hp: Number,
});
mongoose.model('Room', RoomSchema);
var Room = mongoose.model('Room');


// Routes
//app.get('/', routes.index);
//app.get('/room', routes.room);

app.get('/', function(req, res){
    var name;
    var template;
    console.log(req.query);
    console.log(req.query.name);
    if (req.query.name) {
        name = req.query.name;
        template = 'index.ejs';
    } else {
        template = 'error.ejs';
    }
    res.render(template, { locals: { name: name } });
});
app.get('/init', function(req, res){
    var p_max = 300;
    if (req.query.max) {
        p_max = req.query.max;
    }

    // all clear
    Room.remove({}, function(error){
        if(!error){
            console.log('remove room:', error);
        }else{
            console.log(error);
        }
    });
    // レコード作成
    var r = new Room();
    r.roomno = 1;
    r.max_hp = p_max;
    r.hp = p_max;
    r.save();

    // debug
    Room.find({}, function (err, docs) {
        console.log('find mongoooooooooooooo');
        console.log(docs);
    });

    res.render('init.ejs', { locals: { name: '' } });
});
app.listen(3000);


// socketio
var socketIO = require('socket.io');
var io = socketIO.listen(app);
var key = 4;

io.sockets.on('connection', function(socket) {
    console.log("connection");

    socket.on('click', function(click) {
        console.log("clickkkkkkkkk!!!!!");
        console.log(click);
        var name = click.name;

        // find room
        Room.find({}, function(err, docs) {
            console.log("findddddddddddd!!!!!");
            if(!err) {
                var row = docs[0];
                var max_hp = row.max_hp;
                var hp = row.hp;
                var random = Math.floor( Math.random() * 3 ) + 1;
                var minus_hp = hp - random;
                console.log('hp:' + hp);
                console.log('random:' + random);
                console.log('minus_hp:' + minus_hp);

                Room.update(
                    { }, // condition
                    { $set: { hp: minus_hp } },
                    function(err) {
                        if(err){
                            console.log('update error : '+ err);
                        } else {
                            // フラグ設定
                            var adjust = (minus_hp / max_hp);
                            console.log('adjust:' + adjust);
                            if(adjust <= 0) {
                                // 終了時
                                console.log('finished!');
                                io.sockets.emit('key', { value: 6 });
                                io.sockets.emit('finish', { finish : true, user : name });
                            } else if(adjust < 0.15) {
                                console.log('adjust');
                                io.sockets.emit('key', { value: 5 });
                            } else if(adjust < 0.3) {
                                console.log('adjust');
                                io.sockets.emit('key', { value: 2 });
                            }
                            io.sockets.emit('click', { name : name, damage: random });
                        }
                    }
                );
            }
        });
    });

    io.sockets.emit('key', { value: 4 });

    socket.on('disconnect', function(){
        console.log("disconnect");
	});
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
