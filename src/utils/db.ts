import { connect } from "mongoose";
import { env } from "./env";

export function connectToMongoDB() {
  const promise = connect(env.MONGO_DB_URI!, {
    dbName: env.MONGO_DB_NAME,
  });
  return promise;
}
