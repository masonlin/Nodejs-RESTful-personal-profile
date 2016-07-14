/**
* @overview
*
* @author Mason Lin
* @version v1.0.1 2015/09/09
*          v1.1.0 2016/07/12 add socket.io
*          v1.2.0 2016/07/13 add postgreSQL
*/
// create server.
//var app = require('express').createServer(),
var app = require('express')();
port = process.env.PORT || 8080;
users = [
          {name: 'Mason Lin'},   //:id=0
          {name: 'Stuart Lin'},   //:id=1
          {name: 'Jessica Lin'}   //:id=2
        ];
app.listen(port);




//>>>>>>>>>> http get + routes >>>>>>>>>>
//app.all('/user/:id/:op?', function(req, res, next){
//usage: http://127.0.0.1:8080/user/0
app.all('/user/:id', function(req, res, next){
                              req.user = users[req.params.id];
                              if (req.user) {
                                  next();
                              } else {
                                  next(new Error('cannot find user ' + req.params.id));
                              }
                          });


app.get('/profile/:id', function(req, res){
                        var clsPG = require('./mason_modules/profilePg');
                        res.set({'Access-Control-Allow-Origin': '*'});
                        var oPG = new clsPG(res, req.params.id);
                        oPG.getData();

                     });

app.get('/user/:id', function(req, res){
                         res.set({'Access-Control-Allow-Origin': '*'});
                         //res.send('viewing ' + req.user.name);
                         //res.send(req.user.name);
                         //res.send(JSON.stringify({name:req.user.name}));
                         res.json({name:req.user.name});
                     });


 app.get('/user/:id/*', function(req, res, next){
                               req.user = users[req.params.id];
                               if (req.user) {
                                   next();
                               } else {
                                   next(new Error('cannot find user ' + req.params.id));
                               }
                           });

app.get('/user/:id/edit', function(req, res){
                              res.send('editing ' + req.user.name);
                          });

app.get('/user/:id/delete', function(req, res){
                                res.send('deleting ' + req.user.name);
                            });


app.get('/', function(req, res){
    //>>>>>>>>>> html >>>>>>>>>>
    app.use(require('express').static(require('path').join(__dirname, '/public')));  //以下這4行用來載入public路徑下的靜態文件如html檔
    app.set('views', __dirname + '/public');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    res.render('node_profile_post_http.html');
    //<<<<<<<<<< html <<<<<<<<<<
});


app.get('*', function(req, res){
                 //res.send('Page not found!', 404);
                 res.status(400).send('Page not found!');
             });

//<<<<<<<<<< http get + routes <<<<<<<<<<

//>>>>>>>>>> http post + routes >>>>>>>>>>
app.use(require('body-parser').urlencoded({extended:true}));   //用來解析HTML，之後req才會有資料
app.post('/post_test', function(req, res, next){
    //res.send('hi, ' + req.query.name);
    //res.send('your education backgroud: ' + req.query.education);
    //res.send('your education backgroud: ' + req.param('education'));
    res.send('hi, ' + req.body.name + ', your education backgroud:  ' + req.body.education);
});
//<<<<<<<<<< http post + routes <<<<<<<<<<




console.log('start express server\n');



//>>>>>>>>>> new socket.io >>>>>>>>>>
var server = require('http').createServer(app);
var io = require('socket.io')(server,{origins: 'localhost:* 127.0.0.1:* http://localhost:* http://127.0.0.1:* http://192.168.*.*:*',
                                          log: true,
                                  'log level': 3});
server.listen('8081', function(){
  console.log("Socket server up and running...");

});

io.sockets.on('connection', function(socket){
  //console.log('connection....');

  //socket.emit('clientReceiveMsg', JSON.stringify({time: 'test'}));
  setInterval(function(){
    var date = new Date();
    //socket.emit('clientReceiveMsg',JSON.stringify({'date': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()}));
    socket.broadcast.emit('clientReceiveMsg',JSON.stringify({'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()}));
  }, 100);

  socket.on('serverReceiveMsg', function(data){
    console.log('server receive data');
  });
});
//<<<<<<<<<< new socket.io <<<<<<<<<<
