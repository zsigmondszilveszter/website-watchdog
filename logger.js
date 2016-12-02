const fs = require('fs')

let f='log.txt';

module.exports.writeLog = (row) => {
    fs.appendFile(f,row + "\r",function(err){
      if(err) console.error(err);
    });
}
