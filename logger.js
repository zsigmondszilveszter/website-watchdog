const fs = require('fs')
const endOfLine = require('os').EOL;

let f='log.txt';

module.exports.writeLog = (row) => {
    fs.appendFile(f,row+endOfLine,function(err){
      if(err) console.error(err);
    });
}
