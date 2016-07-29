/**
* @overview
*
* @author Mason Lin
* @version v1.0.0 2016/07/13 Original
*          v1.1.0 2016/07/21 modify for pre-release
*          v1.2.0 2016/07/29 modify return value
*/

var pg = require('pg');
var clsMasonConf = require('./masonconf');
var oMasonConf = new clsMasonConf();


var result;

var ClsPG = function(res, profileId){
  // this.conStr = process.env.DATABASE_URL || 'Postgres://postgres:aabbcc11@localhost:5432/profiledb';

  if(oMasonConf.isDev == true){
    this.conStr = process.env.DATABASE_URL || 'Postgres://postgres:aabbcc11@localhost:5432/profiledb';
  }else{
    this.conStr = process.env.DATABASE_URL || 'postgres://uhiovunxefljkw:NOBbE94z3FQq0IliteWmz9Xg2V@ec2-54-163-228-0.compute-1.amazonaws.com:5432/dj6thr6fi7vmc';
    pg.defaults.ssl = true;  //heroku SSL
  }

  this.getData = function(){

      pg.connect(this.conStr, function(error, client, done){
        if(error){
          done();
          console.log(error);
          return 'connetion fail!';
        }

        //var qryStr = 'SELECT * FROM profile WHERE id=' + profileId + ';';
        if(oMasonConf.isDev == true){
          var qryStr = 'SELECT * FROM profile WHERE id=' + profileId + ';';
        }else{
          var qryStr = 'SELECT * FROM mason_info WHERE col1=\'' + profileId + '\';';
        }

        var query = client.query(qryStr);

        query.on('row', function(row, result){
          //console.log('getRowData: ' + JSON.stringify(row, null, "    "));
          result.addRow(row);
        });

        query.on('end',function(result){
          done();
          res.json(result.rows[0]);
        });

      });
  };

};

module.exports = ClsPG;
