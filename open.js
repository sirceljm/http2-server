const opn         = require('opn')
const errorOpn    = require('debug')('http2:error:opn')

const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
}

const server = http2.createSecureServer(options);

const serverRoot = "./";

function respondToStreamError(err, stream) {
  console.log(err);
  if (err.code === 'ENOENT') {
    stream.respond({ ":status": HTTP_STATUS_NOT_FOUND });
  } else {
    stream.respond({ ":status": HTTP_STATUS_INTERNAL_SERVER_ERROR });
  }
  stream.end();
}

server.on('stream', (stream, headers) => {
  console.log("sad", stream);
  const reqPath = headers[HTTP2_HEADER_PATH];
  const reqMethod = headers[HTTP2_HEADER_METHOD];

  const fullPath = path.join(serverRoot, reqPath);
  const responseMimeType = mime.lookup(fullPath);

  if (fullPath.endsWith(".html")) {
    console.log('html');
    // handle HTML file
    stream.respondWithFile(fullPath, {
      "content-type": "text/html"
    }, {
      onError: (err) => {
        respondToStreamError(err, stream);
      }
    });

  } else {
    // handle static file
    console.log(fullPath);
    stream.respondWithFile(fullPath, {
      'content-type': responseMimeType
    }, {
      onError: (err) => respondToStreamError(err, stream)
    });
  }

});

server.listen(4443);

const {
  open, URL
} = require('./options')

module.exports = () => {
  if (! open) return
  
  const app = typeof open == 'string'
    ? open.match(/(\w+|-+\w+)/g) : null
  
  opn(URL, { app })
  .catch(error => errorOpn(error.toString().replace('ENOENT','')))
}
