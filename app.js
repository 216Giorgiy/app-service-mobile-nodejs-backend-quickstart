
// This is a base-level Azure Mobile App SDK.
var express = require('express'),
	bodyParser = require('body-parser'),
	azureMobileApps = require('azure-mobile-apps'),
	logger = require('azure-mobile-apps/src/logger');

// Obtain our custom API, which exports an express Router.
var updateTagsApi = require('./api/updateTags');

// Set up a standard Express app
var app = express();

// If you are producing a combined Web + Mobile app, then you should handle
// anything like logging, registering middleware, etc. here

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));	

// Configuration of the Azure Mobile Apps can be done via an object, the
// environment or an auxiliary file.  For more information, see
// http://azure.github.io/azure-mobile-apps-node/global.html#configuration
var mobileApp = azureMobileApps({
    // Explicitly enable the Azure Mobile Apps home page
    homePage: true,
    // Explicitly enable swagger support. UI support is enabled by
    // installing the swagger-ui npm module.
    swagger: true
});

// Import the files from the tables directory to configure the /tables endpoint
mobileApp.tables.import('./tables');

// Import the files from the api directory to configure the /api endpoint
mobileApp.api.import('./api');

// Initialize the database before listening for incoming requests
// The tables.initialize() method does the initialization asynchronously
// and returns a Promise.
mobileApp.tables.initialize()
    .then(function () {
	// Register the Azure Mobile Apps middleware.
	app.use(mobileApp);    	
		
	// Register the router we configure in our custom API module
	// This must be done after registering the mobile app.
	app.use('/api/updatetags', updateTagsApi(mobileApp.configuration));
	
	// Listen for requests.
	app.listen(process.env.PORT || 3000);   		
    });
