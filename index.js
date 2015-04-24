let http = require('http')
let fs = require('fs')
let request = require('request')
let through = require('through')
let argv = require('yargs')
		.default('host', '127.0.0.1')
		.argv
let scheme = "http://"

let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme + argv.host + ':' + port
let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout

http.createServer((req, res) => {
	logStream.write(`Request received at: ${req.url}\n`)
	for (let header in req.headers) {
		res.setHeader(header, req.headers[header])
	}
	//req.pipe(logStream)
	through(req, logStream, {autoDestroy: false})
	req.pipe(res)
}).listen(8000)

logStream.write('Echo server listening at http://127.0.0.1:8000\n')

http.createServer((req, res) => {
	let url = destinationUrl;
	if (req.headers['x-destination-url']) {
		url = req.headers['x-destination-url']
	}
	let options = {
		headers: req.headers,
		url: url + req.url
	}
	logStream.write(`\nProxying request to: ${options.url}\n`)
	
	options.method = req.method
	let destinationRes = req.pipe(request(options))
	logStream.write(JSON.stringify(destinationRes.headers))
	destinationRes.pipe(res)
}).listen(8001)

logStream.write('Proxy server listening at http://127.0.0.1:8001\n')