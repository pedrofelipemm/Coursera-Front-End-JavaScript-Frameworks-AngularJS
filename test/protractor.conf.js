exports.config = {
	allScriptsTimeout : 11000,
	specs : [ 'e2e/*.js' ],
	capabilities : {
		'browserName' : 'firefox'
	},
	baseUrl : 'http://localhost:3000/',
	framework : 'jasmine',
	directConnect : true,
	jasmineNodeOpts : {
		defaultTimeoutInterval : 30000
	}
};