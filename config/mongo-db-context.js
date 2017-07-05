const mongoose 	 = require('mongoose');

//Local connection
let mongoConnectionLocal = {	
	'url': 'mongodb://sarwin:01610715@localhost:27017/node-cron-test-db'
};

//Development database from mongolab
let mongoConnectionOnline = {
	'url': 'mongodb://databaseUser:01610715@ds149122.mlab.com:49122/node-cron-test-db'
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	mongoose.Promise = global.Promise;
	switch (env) {
	    case 'dev':
	    	app.set('port', process.env.PORT || 9000);
	        mongoose.connect(mongoConnectionOnline.url, err => { if(err) { console.log(err); }}); 
	        break;
		case 'local':
	    	app.set('port', process.env.PORT || 9001);
	        mongoose.connect(mongoConnectionLocal.url, {auth:{authdb:"admin"}},  err => { if(err) { console.log(err); }});
			break;
	};
};
