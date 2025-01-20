import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import adminRoutes from "./routes/admin.route.js";
import staffRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
//routes declaration
app.use('/api/v1/admin', adminRoutes); 
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/auth', authRoutes);

// app.use('/api/v1/staff', staffRoutes);

export { app } 