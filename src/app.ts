import express from "express";
import userRoutes from "./user/user.routes";
import todoRoutes from "./todo/todo.routes";
import { connectToMongoDB } from "./utils/db";

await connectToMongoDB();

const app = express();

app.use(express.json());

/* Routes */
app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
