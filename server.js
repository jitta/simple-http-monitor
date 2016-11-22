const request = require('request')
const express = require('express')
const basicAuth = require('basic-auth')

const app = express()
const port = process.env.PORT || 3000

const HTTP_USER = process.env.HTTP_USER
const HTTP_PASS = process.env.HTTP_PASS

const auth = function (req, res, next) {
  if (!HTTP_PASS) return next()
  const credentials = basicAuth(req)
  if (!credentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Auth me please!"')
    res.end()    
  }
  if (credentials.name !== HTTP_USER || credentials.pass !== HTTP_PASS) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Auth me please!"')
    console.log('UnAuthenticate')
    return res.status(400).end('Access denied')
  }
  return next()
} 

app.get('/check', auth, (req, res) => {
  if (req.query && req.query.url) {
    request(req.query.url, (err, response) => {
      if (err) {
        console.log(`${req.query.url} -> HTTP REQUEST ERROR: ${err.message}`)
        return res.status(500).json(err)
      }
      res.setHeader('content-type', response.headers['content-type'])
      console.log(`${req.query.url} -> ${response.statusCode}`)
      return res.end(response.body)
    }) 
  } else {
    res.status(400).send('Not url specific.')
  }
})

app.listen(port, () => {
  console.log(`Listening... ${port}`)
})
