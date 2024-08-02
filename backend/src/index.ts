import cors from "cors";
import express from "express";
import helmet from "helmet";
import config from "./config";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import router from "./routes";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(genericErrorHandler);
app.use(notFoundError);
app.listen(config.port, () => {
  console.log(`Server started listening on port: ${config.port}`);
});
