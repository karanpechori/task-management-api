import { Request, Response, NextFunction } from "express";
import { verify } from "../utils/hashing";
import { asyncResult } from "../utils/results";
import { User } from "./user.model";

export async function verifyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fullstring = req.headers.authorization;

  if (!fullstring) {
    return res.status(401).send("Unauthorized");
  }

  const authType = fullstring.split(" ")[0];

  if (authType !== "Basic") {
    return res.status(300).send("Auth Type Unsupported");
  }

  const base64 = fullstring.split(" ")[1];

  if (!base64) {
    return res.status(401).send("Unauthorized");
  }

  const [email, password] = Buffer.from(base64, "base64").toString().split(":");

  if (!email || !password) {
    return res.status(401).send("Unauthorized");
  }

  const foundUser = await asyncResult(() => User.findOne({ email }));

  if (!foundUser.ok) {
    return res.status(404).send(foundUser.error);
  }

  if (!foundUser.value) {
    return res.status(401).send("Unauthorized");
  }

  const isPasswordCorrect = await verify(password, foundUser.value.password);
  if (!isPasswordCorrect) {
    return res.status(401).send("Unauthorized");
  }

  res.locals.user = foundUser.value;

  next();
}
