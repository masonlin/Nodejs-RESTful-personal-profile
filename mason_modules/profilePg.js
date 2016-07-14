var pg = require('pg');

var result;

var ClsPG = function(res, profileId){
  this.conStr = process.env.DATABASE_URL || 'Postgres://postgres:aabbcc11@localhost:5432/profiledb';

  this.getData = function(){
      pg.connect(this.conStr, function(error, client, done){
        if(error){
          done();
          console.log(error);
          return 'connetion fail!';
        }

        var qryStr = 'SELECT * FROM profile WHERE id=' + profileId + ';';
        var query = client.query(qryStr);

        query.on('row', function(row, result){
          //console.log('getRowData: ' + JSON.stringify(row, null, "    "));
          result.addRow(row);
        });

        query.on('end',function(result){
          done();
          //console.log(JSON.stringify(result.rows, null, "    "));
          //return JSON.stringify(result.rows, null, "    ");
          //res.json(result);       //information include all data
          res.json(result.rows);
        });

      });
  };

};

module.exports = ClsPG;
