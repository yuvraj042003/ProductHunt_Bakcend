require('dotenv').config()


const path = require('path')

// Extra Security Package
const helmet = require('helmet')
const xss = require('xss-clean')
const express = require('express')
const app = express()
const UserRouter = require('./router/UserRouter')
const ProductRouter = require('./router/productRoute')
const CommentRouter = require('./router/commentsRouter')

//  Connect to the database
const connectDB = require('./db/connct')
//  Router

//  Error Handler

//  Implement 
app.use(express.json())
app.use(helmet())
// app.use(xss())

// Routes
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/product', ProductRouter)
app.use('/api/v1/comment', CommentRouter)

// app.use(express.static(path.resolve(__dirname, './public')))

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './public/index.html'))
// })

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        // Connect to the database
        // await connectDB(process.env.MONGO_URI)
        await connectDB()
        console.log('Database connected successfully')
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()