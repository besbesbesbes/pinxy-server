require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const notFound = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const authRoute = require("./routes/auth-route")

//middleware
app.use(cors());
app.use(express.json());

//routing
app.use("/api/auth", authRoute)
app.use(notFound);
app.use(errorMiddleware);

//start server
const port = process.env.PORT || 8099;
app.listen(port, () => console.log("Server on ", port));
