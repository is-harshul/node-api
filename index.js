const { stat } = require('fs');
/* 
    Main file for API
*/

// Imports and dependencies
const http = require('http');
const { type } = require('os');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Important variables
const port = 3042
const exampleUrl = 'http://localhost:3042/fofo/afi?foo=bar';

// Create server and should repond to string
const server = http.createServer((req, res) => {
    // This function runs when we hit the server

    // Check the path
    const path = url.parse(req.url, true);
    const host = path.host;
    const trimmedUrl = path.pathname.replace(/^\/|\/+$/g, '');
    const searchQuery = path.search;
    
    // Query object
    const queryParamsObject = path.query;
    
    // Check the Headers
    const headers = req.headers;

    // What is the method of request
    const method = req.method;

    // Get payload if any
    const decoder = new StringDecoder('utf-8');
    let accumulator = '';
    // When req has data, do this 👇
    req.on('data', (data) => {
        accumulator += decoder.write(data);
    });
    req.on('end', () => {
        // Ending the buffer and decoder
        accumulator += decoder.end(); 

        const data = {
            host,
            headers,
            method,
            trimmedUrl,
            searchQuery,
            accumulator
        }

        // Check the handlers and assign them properly here as per there nature.
        const chosenHandler = typeof(router[trimmedUrl]) !== 'undefined' ? router[trimmedUrl] : handlers.notFoundHandler;
        console.log(chosenHandler, chosenHandler.toString());
        // Now we have the chosen handler now set the statusCodes and payload
        // Route the request to the specific handler
        chosenHandler(data, (statusCode, payload) => {
            // Use the status from the handler or default: 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200; 
            // Use the JSON payload or default: {}
            payload = typeof(payload) === 'object' ? payload : {};

            // Conver the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            // Write and END the response
            res.writeHead(statusCode);
            res.write(payloadString);
            res.write('Hello user');
            res.end();
            console.log('Returning this: ' + statusCode + ' paylaodString: ' + payloadString);
        });

        // console.log('Hello from the other side!', {port, method, headers, host, trimmedUrl, searchQuery, queryParamsObject, accumulator});
    })

    // CAN WRITE BELOEW ALSO
    // // Write and END the response
    // res.write('Hello user');
    // res.end();
    // console.log('Hello from the other side!', {port, method, headers, host, trimmedUrl, searchQuery, queryParamsObject, buffer});
})

// Listen to the server and show
server.listen(port, () => {
    console.log(`Server successfully connected to port: ${port}`)
})

// Define Handlers
const handlers = {};

// Sample Handler
handlers.sampleHandler = (data, callback) => {
    // Callback has Status code and data object to be returnd
    callback(406, {'name': 'Sample handler handled it.'});
}
// Not found Handler
handlers.notFoundHandler = (data, callback) => {
    // Callback has Status code and data object to be returnd
    callback(404, 'Route not found.');
}

// Define a router
const router = {
    'sample': handlers.sampleHandler
}