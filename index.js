const websiteurl = 'https://www.cashinfo.com';
const timeout = 60000; // msec max timeout
const to = 'szilveszter@onelogic.fr, zmathe@onelogic.fr, pmpeugnet@cashinfo.com';

const Curl = require( 'node-libcurl' ).Curl;
const nodemailer = require('nodemailer');
const conf = require("./config.json");
const logger = require('./logger');

let mailer = nodemailer.createTransport(conf.smtp_options)

let mailOptions = {
    from: '"Szilveszter Zsigmond" <alert@onelogic.ro>', // sender address
    to: to, // list of receivers
    subject: 'ALERT! '+websiteurl+' is down, timeout = '+parseInt(timeout/1000)+' sec', // Subject line
};
let counter = 0;

let sendEmail = text => {

    mailOptions.text = text; // plaintext body
    mailOptions.html = '<b>'+text+'</b>'; // html body
    mailer.sendMail(mailOptions, function(error, info){
        if(error){
            logger.writeLog('Message NOT sent ERROR: ' + error)
            return error
        }
        logger.writeLog('Message sent: ' + info.response)
    });
}

setInterval(()=>{

    let curl = new Curl();
    curl.setOpt( 'URL', websiteurl );
    curl.setOpt( 'FOLLOWLOCATION', true );
    curl.setOpt( 'TIMEOUT_MS', timeout);

    curl.on( 'end', function( statusCode, body, headers ) {
        let date = new Date();
        let text = date.toLocaleString()+", statuscode: "+statusCode+ ", time elapsed: "+parseInt(this.getInfo( 'TOTAL_TIME' ))*1000
        logger.writeLog(text)

        if(statusCode == 404 || statusCode == 500){
            sendEmail(text)
        }

        this.close();
    });

    curl.on( 'error',error => {
        let date = new Date();
        let text = date.toLocaleString()+', ' + websiteurl+' is down, connection timeout set to '+parseInt(timeout/1000)+' sec'

        if(++counter > 1){
            counter = 0;
            sendEmail(text)
        }

        logger.writeLog(text)
        curl.close.bind( curl )
    });
    curl.perform();
},60000)
