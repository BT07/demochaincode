// Step 1 ==================================
    var Ibc1 = require('ibm-blockchain-js');
    var ibc = new Ibc1(/*logger*/);             //you can pass a logger such as winston here - optional
//    var reg = require('./utils/ws_registration');   
    var chaincode = {};

    // ==================================
    // configure ibc-js sdk
    // ==================================
    var options =   {
        network:{
            peers:   [{
                "api_host": "75eab341dc4d4863be3343d49a2a34a2-vp0.us.blockchain.ibm.com",
                "api_port": 5002,
                "api_port_tls": 5002,
                "id": "75eab341dc4d4863be3343d49a2a34a2-vp0"
            }],
            users:  [{
               "enrollId": "user_type1_0",
                "enrollSecret": "899297c9ee"
            }],
            options: {                          //this is optional
                quiet: true, 
                timeout: 60000
            }
        },
        chaincode:{
                      //  zip_url: 'https://github.com/deepalipatil/SmartPropertyRegistry/archive/v1.0.zip',
                        //unzip_dir: 'SmartPropertyRegistry-1.0/chaincode',                                                   
                        //subdirectroy name of chaincode after unzipped
                        //git_url: 'http://gopkg.in/deepalipatil/SmartPropertyRegistry.v1/chaincode', 


                         zip_url: 'https://github.com/aishwarya2295/demochaincode//archive/demo.zip',
                        unzip_dir: 'demochaincode-demo/finished',                                                   
                        //subdirectroy name of chaincode after unzipped
                       // git_url: 'http://gopkg.in/deepalipatil/SmartPropertyRegistry.v1/chaincode', 
                       git_url:'https://github.com/aishwarya2295/demochaincode/finished',
            deployed_name: null 
        }
    };
    // Step 2 ==================================
    ibc.load(options, cb_ready);

    // Step 3 ==================================
    function cb_ready(err, cc){                             //response has chaincode functions
        chaincode = cc;
        //reg.setup(ibc, cc);
        //app2.setup(ibc, cc);

    // Step 4 ==================================
    console.log('Name'+cc.details.deployed_name);		
        if(cc.details.deployed_name === null){                //decide if I need to deploy or not
            console.log('Before chaincode deploy');
            cc.deploy('init', ['josh','1234'], null, cb_deployed);
            console.log('Chaincode deployed`	');
        }
        else{
            console.log('chaincode summary file indicates chaincode has been previously deployed');
            cb_deployed();
        }

    }
    // Step 5 ==================================
    function cb_deployed(err){
        console.log('sdk has deployed code and waited to read'+chaincode);
		var response = require('./exressnode');
		var u = response;
		var uname = u.patient_name;
		var desc = u.problem_desc;
		var allergy = u.patient_allergy
		var user_name ='USER_'+uname;
		console.log(allergy)
        chaincode.query.read([user_name], function(err, data){
        //console.log('read abc:', data, err);

         //console.log('data has been written');
        //chaincode.invoke.write(['USER_josh', 'Josh','sick','cold']);
		
        chaincode.invoke.write([user_name,uname,desc,allergy]);
        console.log('Invoke done');
         
    });
}