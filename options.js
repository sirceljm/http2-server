const commander = require('commander')
const path = require('path')

const opts = commander
  .version(require('./package.json').version)
  .usage('[path] [options]')
  .option(
    '-a, --address [0.0.0.0]',
    'address to use',
    '0.0.0.0'
  ).option(
    '-p, --ssl-port [4443]',
    'ssl port to use',
    4443
  ).option(
    '--http-port [8080]',
    'http port which redirects to ssl port',
    8080
  ).option(
    '-c, --cache',
    'enable cache'
  ).option(
    '-m, --maxAge [0]',
    `cache maxAge in ms acceptable string
    https://github.com/zeit/ms
`
  ).option(
    '-P, --no-push',
    'disable naive PUSH_PROMISE'
  ).option(
    '-o, --open [xdg-open]',
    `open default app after starting the server
    -o firefox
    -o "google-chrome --incognito"
    -o "curl --insecure"
`
  ).option(
    '-l, --log [dev]',
    `log format (dev|combined|common|short|tiny)
    https://github.com/expressjs/morgan#predefined-formats
`,
    'dev'
  ).option(
    '-s, --silent',
    'suppress log messages from output'
  ).option(
    '--cors',
    'enable CORS'
  ).option(
    '-S, --no-ssl',
    `disable https
      Works as plain http server without http2, push_promise
`
  ).option(
    '-e, --cert [certs/cert.pem]',
    'path to ssl cert file',
    path.join(__dirname, './certs/cert.pem')

).option(
    '-k, --key  [certs/key.pem]',
    'path to ssl key file',
        path.join(__dirname, 'certs/key.pem'),
  ).option(
    '--generate-cert',
    'save autogenerated certificates and exit'
  ).option(
    '--trust-cert',
    'add certificate to trusted (currently linux only)'
  ).option(
    '-g, --compression',
    'enable deflate/gzip/brotli/zopfli'
  ).option(
    '-i, --index [index.html]',
    'Specify index file name',
    'index.html'
  ).option(
    '--proxy [https://127.0.0.1:4443]',
    `Proxies all requests which can't be resolved locally to the given url.
e.g.: -P http://someurl.com`
  ).option(
    '-I, --no-autoindex',
    'Disable auto index'
  ).option(
    '--404 []',
    '404 error page [blocks proxying]'
  )
  .parse(process.argv)


opts.protocol = opts.ssl ? 'https' : 'http'
opts.serverType = opts.ssl ? 'Http2/Https' : 'Http'
opts.URL = `${opts.protocol}://${opts.address}:${opts.ssl ? opts.sslPort : opts.httpPort}`

module.exports = opts
// http://stackoverflow.com/questions/31100474/accessing-non-ssl-socket-io-nodejs-server-from-ssl-apache-request-same-host
// -r or --robots Provide a /robots.txt (whose content defaults to 'User-agent: *\nDisallow: /')
