require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const searchRouter = require("./routes/searchRoute");
const notFound = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const postRoute = require("./routes/post-route");
const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin");
const aiRoute = require("./routes/ai-route");

//middleware
app.use(cors());
app.use(express.json());

//routing
app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/search", searchRouter);
app.use("/api/ai", aiRoute);
app.use(notFound);
app.use(errorMiddleware);

//start server
const port = process.env.PORT || 8099;
app.listen(port, () => console.log("Server on ", port));
