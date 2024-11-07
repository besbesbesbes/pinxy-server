require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const searchRoute = require("./routes/searchRoute");
const postRoute = require("./routes/post-route");
const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin");
const aiRoute = require("./routes/ai-route");
const userRoute = require("./routes/userRoute");
const followRoute = require("./routes/follow-route");
const notFound = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");

//middleware
app.use(cors());
app.use(express.json());

//routing
app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/search", searchRoute);
app.use("/api/ai", aiRoute);
app.use("/api/user", userRoute);
app.use("/api/follow", followRoute)
app.use(notFound);
app.use(errorMiddleware);

//start server
const port = process.env.PORT || 8099;
app.listen(port, () => console.log("Server on ", port));
