const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const { PORT } = require('./config/server-config')

const serverSetUp = async () => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))

    app.use(morgan('combined'))
    app.use('/bookingservice', createProxyMiddleware({target: 'http://localhost:3002/', changeOrigin: true}))
    app.get('/home', ( req, res ) => {
        return res.json({message: 'OK'})
    })

    app.listen(PORT, () => {
        console.log(`Server started at Port ${PORT}`)
    })
}

serverSetUp();