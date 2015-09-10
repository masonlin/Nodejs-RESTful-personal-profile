/**
* @overview
*
* @author Mason Lin
* @version V1.0.1 2015/09/09
*/
// create server.
//var app = require('express').createServer(),
var app = require('express')(),
port = process.env.PORT || 8080,
users = [
          {name: 'Mason'},   //:id=0
          {name: 'Stuart'}   //:id=1
        ];
app.listen(port);

//app.all('/user/:id/:op?', function(req, res, next){
app.all('/user/:id/:oo', function(req, res, next){
                              req.user = users[req.params.id];
                              if (req.user) {
                                  next();
                              } else {
                                  next(new Error('cannot find user ' + req.params.id));
                              }
                          });

app.get('/user/:id', function(req, res){
                         res.send('viewing ' + req.user.name);
                     });

app.get('/user/:id/edit', function(req, res){
                              res.send('editing ' + req.user.name);
                          });

app.get('/user/:id/delete', function(req, res){
                                res.send('deleting ' + req.user.name);
                            });

app.get('*', function(req, res){
                 //res.send('Page not found!', 404);
                 res.status(400).send('Page not found!');
             });

console.log('start express server\n');
