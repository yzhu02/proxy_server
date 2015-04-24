# Node.js training prework -- Proxy Server

## Description
* The proxy server transfers the request to the specified destination server and transfer the response to the client.

## Setup
```
git clone git@github.com:yzhu02/proxy-server.git
cd proxy-server
npm install
```

## Features
* The proxy server has capability to accept CLI arguments `host`(defaulted to 127.0.0.1 if not specified) and `port`, or `url` alone.
* If we don't pass any CLI argument the downstream system URL will be `http://127.0.0.1:8000` which is nothing but a echo server
* The proxy server also takes CLI argument `logfile` to write logger output to a file.
* Alternatively instead of `url` CLI argument client can pass request header `x-destination-url` to pass to destination server.

## Examples
1) Simple echo server
Run server:
`babel-node index.js`

Run client:
`curl -X POST http://127.0.0.1:8001 -d "Hello Node" -H "myheader: abc" -v`

Server output:
```
yzhu02-mac:proxy_server yzhu02$ babel-node index.js
Echo server listening at http://127.0.0.1:8000
Proxy server listening at http://127.0.0.1:8001

Proxying request to: http://127.0.0.1:8000/
{"user-agent":"curl/7.30.0","host":"127.0.0.1:8001","accept":"*/*","myheader":"abc","content-length":"10","content-type":"application/x-www-form-urlencoded"}Request received at: /
```

Client: output: 
```
yzhu02-mac:proxy_server yzhu02$ curl -X POST http://127.0.0.1:8001 -d "Hello Node" -H "myheader: abc" -v
* About to connect() to 127.0.0.1 port 8001 (#0)
*   Trying 127.0.0.1...
* Adding handle: conn: 0x7fd11a801a00
* Adding handle: send: 0
* Adding handle: recv: 0
* Curl_addHandleToPipeline: length: 1
* - Conn 0 (0x7fd11a801a00) send_pipe: 1, recv_pipe: 0
* Connected to 127.0.0.1 (127.0.0.1) port 8001 (#0)
> POST / HTTP/1.1
> User-Agent: curl/7.30.0
> Host: 127.0.0.1:8001
> Accept: */*
> myheader: abc
> Content-Length: 10
> Content-Type: application/x-www-form-urlencoded
> 
* upload completely sent off: 10 out of 10 bytes
< HTTP/1.1 200 OK
< user-agent: curl/7.30.0
< host: 127.0.0.1:8001
< accept: */*
< myheader: abc
< content-length: 10
< content-type: application/x-www-form-urlencoded
< connection: keep-alive
< date: Fri, 24 Apr 2015 22:02:30 GMT
< 
* Connection #0 to host 127.0.0.1 left intact
Hello Node
```

2) Proxy to google.com via CLI argument `url`
Run server:
`nodemon --exec babel-node -- index.js --url='http://www.google.com'`

Run client:
`curl -v http://127.0.0.1:8001`

Server output:
```
yzhu02-mac:proxy_server yzhu02$ nodemon --exec babel-node -- index.js --url='http://www.google.com'
24 Apr 15:03:51 - [nodemon] v1.3.7
24 Apr 15:03:51 - [nodemon] to restart at any time, enter `rs`
24 Apr 15:03:51 - [nodemon] watching: *.*
24 Apr 15:03:51 - [nodemon] starting `babel-node index.js --url=http://www.google.com`
Echo server listening at http://127.0.0.1:8000
Proxy server listening at http://127.0.0.1:8001

Proxying request to: http://www.google.com/
{"user-agent":"curl/7.30.0","host":"127.0.0.1:8001","accept":"*/*"}
```

Client output:
```
yzhu02-mac:proxy_server yzhu02$ curl -v http://127.0.0.1:8001
* About to connect() to 127.0.0.1 port 8001 (#0)
*   Trying 127.0.0.1...
* Adding handle: conn: 0x7fa4f3004000
* Adding handle: send: 0
* Adding handle: recv: 0
* Curl_addHandleToPipeline: length: 1
* - Conn 0 (0x7fa4f3004000) send_pipe: 1, recv_pipe: 0
* Connected to 127.0.0.1 (127.0.0.1) port 8001 (#0)
> GET / HTTP/1.1
> User-Agent: curl/7.30.0
> Host: 127.0.0.1:8001
> Accept: */*
> 
< HTTP/1.1 503 Service Unavailable
< content-type: text/html; charset=UTF-8
< content-length: 673
< connection: close
< p3p: CP="CAO PSA OUR"
< expires: Thu, 01 Jan 1970 00:00:00 GMT
< cache-control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
< pragma: no-cache
< Date: Fri, 24 Apr 2015 22:04:00 GMT
< 

<html>

<head>

<title>Access restricted</title>

</head>

<body>

<blockquote>

<left>

<p>

<img src=http://i2.walmartimages.com/i/catalog/modules/G0040/wmlogo.gif>

<br>

<font face=verdana size=3 color=navy>Access to this website is restricted as it is known to contain inappropriate or malicious content that could infect your computer. <br><br>If you believe that this website is blocked in error and you need to access this website for business use, please follow the procedure described <a href=http://intra/sites/Information_Security/Process%20%20Procedures/SIG_Exception_Request_Procedure.aspx?PageView=Shared>here</a> to initiate an exception request. </font>

* Closing connection 0
```

