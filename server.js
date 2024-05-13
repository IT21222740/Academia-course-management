require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const { authenticate } = require("./middleware/auth");
const { PORT, MONGO_URI, RABIT_MQ_URI, mainRoutes } = require("./util/config");
const swaggerSpec = require("./swagger.js");
const amqp = require("amqplib/callback_api");

class Server {
  static instance;

  constructor() {
    // checks if an instance of the server already exists and returns it
    if (Server.instance) {
      return Server.instance;
    }

    this.rabbitMqChannel = null;
    this.app = express();

    // Middleware
    this.app.use(express.json());
    this.app.use((req, _res, next) => {
      // console.log(req.path, req.method);
      next();
    });

    const bodyParser = require("body-parser");
    const cors = require("cors");
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    Server.instance = this;
  }
  async start() {
    try {
      await mongoose.connect(MONGO_URI);
      this.app.listen(PORT, () => {
        console.log("Connected to db & listening for requests on port", PORT);
      });

      // Connect to RabbitMQ
      amqp.connect(RABIT_MQ_URI, (error0, connection) => {
        if (error0) {
          throw error0;
        }
        connection.createChannel((error1, channel) => {
          if (error1) {
            throw error1;
          }
          console.log("Connected to RabbitMQ");
          this.rabbitMqChannel = channel;
          // You can use the 'channel' to send/receive messages

          // Routes
          this.app.use(
            mainRoutes.courses,
            // authenticate,
            require("./routes/courses/coursesRoutes")
          );
          this.app.use(
            mainRoutes.docs,
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
          );

          this.app.use((err, _req, res, _next) => {
            const errorStatus = err.status || 500;
            const errorMessage =
              err.message || 'Something Went Wrong, Please Contact Technical Team.';
            return res.status(errorStatus).json({
              success: false,
              status: errorStatus,
              message: errorMessage,
              stack: err.stack,
            });
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
  getRabbitMqChannel() {
    return this.rabbitMqChannel;
  }
}

const serverInstance = new Server();
// If the file is being run directly, start the server
if (require.main === module) {
  serverInstance.start();
}
module.exports = { Server, serverInstance };
