const Curl = require( 'node-libcurl' ).Curl;
const nodemailer = require('nodemailer');
const conf = require("./config.json");

const websiteurl = 'https://www.cashinfo.com';
const timeout = 15000; // msec max timeout

let mailer = nodemailer.createTransport(conf.smtp_options)

let mailOptions = {
    from: '"Szilveszter Zsigmond" <szilveszter@catapult.ro>', // sender address
    to: 'szilveszter@onelogic.fr', // list of receivers
    subject: websiteurl+' is down, timeout ='+parseInt(timeout/1000)+' sec', // Subject line
};

setInterval(()=>{

    let curl = new Curl();
    curl.setOpt( 'URL', websiteurl );
    curl.setOpt( 'FOLLOWLOCATION', true );
    curl.setOpt( 'TIMEOUT_MS', timeout);

    curl.on( 'end', function( statusCode, body, headers ) {
        let date = new Date();
        console.info( date.toLocaleString()+", statuscode: "+statusCode+ ", time elapsed: "+parseInt(this.getInfo( 'TOTAL_TIME' ))*1000 );

        this.close();
    });

    curl.on( 'error',error => {
        let date = new Date();
        let text = date.toLocaleString()+',' + websiteurl+' down, connection timeout set to '+parseInt(timeout/1000)+' sec'
        mailOptions.text = text; // plaintext body
        mailOptions.html = '<b>'+text+'</b>'; // html body

        mailer.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        curl.close.bind( curl )
    });
    curl.perform();
},20000)
