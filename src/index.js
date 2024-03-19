const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const axios = require('axios')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const { PORT } = require('./config/server-config')

const serverSetUp = async () => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))

    const limiter = rateLimit({
        windowMs: 2*60*1000,
        max: 5
    })

    app.use(morgan('combined'))
    app.use(limiter)
    app.use('/bookingservice', async (req, res, next ) => {
        console.log(req.headers['x-axis-token'])
        try {
            const response = await axios.get('http://localhost:3001/api/v1/isauthenticated', {
                headers: {
                    'x-axis-token': req.headers['x-axis-token']
                }
            })
            console.log(response.data)
            console.log('Hi')
            if (response.data.success) {
                next();
            } else {
                return res.status(401).json({
                    message: 'unauthorised'
                })
            } 
        } catch (error) {
            return res.status(401).json({
                message: 'unauthorised'
            })
        }
               
    })
    app.use('/bookingservice', createProxyMiddleware({target: 'http://localhost:3002/', changeOrigin: true}))
    app.get('/home', ( req, res ) => {
        return res.json({message: 'OK'})
    })

    app.listen(PORT, () => {
        console.log(`Server started at Port ${PORT}`)
    })
}

serverSetUp();