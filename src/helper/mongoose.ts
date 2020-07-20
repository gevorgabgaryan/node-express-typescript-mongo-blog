import logger from "../shared/logger";
import mongoose from "mongoose";
import Env from "../../env";
import UserController from "../controllers/user-controller";
const db = Env.db;

class MongooseService {
  static async init() {
    let url: string;
    if (Env.isProd) {
      url = `${db.host}/${db.databaseProd}?tls=true&authSource=admin`;
    } else {
      url = `${db.host}/${db.database}`;
    }
    mongoose.set("strictQuery", false);

    mongoose.connection.on("error", function (err) {
      console.log(err);
      logger.error("Cannot connect to mongoDB");
      logger.error(err);
    });

    mongoose.connection.once("open", function () {
      console.log(`Connection to database is established (${url})`);
      logger.info(`Connection to database is established (${url})`);
    });

    try {
      await mongoose.connect(url);
    } catch (error) {
      console.log(error);
    }
  }
}

export default MongooseService;
