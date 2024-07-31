require("dotenv").config();
const express=require("express");
const { httpServer, app } = require("./socket/socket.socket");
const cors=require("cors")

app.use(express.json());
app.use(cors())
const authRouter=require("./routes/auth.routes");
const chartRouter=require("./routes/chart.routes");
const userRouter=require("./routes/user.routes");
const checkToken = require("./middleware/checkToken.middleware");

app.use("/auth",authRouter);
app.use("/chart",checkToken, chartRouter);
app.use("/user",checkToken, userRouter);

app.get("/", (req, res) => {
  res.send({ message: "hello" });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`server running at ${process.env.PORT}`);
});
