import { Request, Response } from "express";
import { User } from "./user.model";

class UserController {
  async create(req: Request, res: Response) {
    const { name, password, email } = req.body;

    const user = await User.create({ name, password, email });

    res.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async read(_req: Request, res: Response) {
    const { user } = res.locals;

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

export default new UserController();
