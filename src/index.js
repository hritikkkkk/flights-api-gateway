const express = require("express");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(limiter);

app.use(
  "/flightsService",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVER,
    changeOrigin: true,
    pathRewrite: { "^/flightsService": "/" },
  })
);

app.use(
  "/BookingsService",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVER,
    changeOrigin: true,
    pathRewrite: { "^/bookingsService": "/" },
  })
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
