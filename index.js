var Curl = require( 'node-libcurl' ).Curl;

setInterval(()=>{

    let curl = new Curl();
    curl.setOpt( 'URL', 'https://www.cashinfo.com' );
    curl.setOpt( 'FOLLOWLOCATION', true );
    curl.setOpt( 'TIMEOUT_MS', 10000); // 10 sec max timeout

    curl.on( 'end', function( statusCode, body, headers ) {
        let date = new Date();
        console.info( date.toLocaleString()+", statuscode: "+statusCode+ ", time elapsed: "+parseInt(this.getInfo( 'TOTAL_TIME' ))*1000 );

        this.close();
    });

    curl.on( 'error',error => {
        let date = new Date();
        console.log( date.toLocaleString()+", error: ", error);
        curl.close.bind( curl )
    });
    curl.perform();
},20000)
