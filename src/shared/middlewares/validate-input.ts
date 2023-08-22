import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function verifyBodySchemaMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}
