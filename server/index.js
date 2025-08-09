const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// file uploading...
app.use('/uploads', express.static('uploads'))
const mongoose = require('mongoose')
// routers
const router = require('./router/userRoute')
const adminRoute = require('./router/adminRouter')
const sellerRoute = require('./router/sellerRouter')
const productRouter = require('./router/productRouter')
const cartrouter = require('./router/cartRouter')
const checkoutrouter = require('./router/orderRouter')
const Reviewrouter = require('./router/reviewRouter')
// database connectivity code
const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.database_conn)
        console.log("Database connected successfully")
    }
    catch (error) {
        console.log("database connection error", error)
    }
}
dbconnect()

// routing...
app.use('/api/admin', adminRoute)
app.use('/api/user', router)
app.use('/api/seller', sellerRoute)
app.use('/api/product', productRouter)
app.use('/api/cart',cartrouter)
app.use("/api/order",checkoutrouter);
app.use("/api/review",Reviewrouter);
// do not give 6000 as PORT it arises issues
const port = process.env.PORT || 9000;
app.listen(port,()=>{
    console.log("Server:9000 Started Successfully")
})