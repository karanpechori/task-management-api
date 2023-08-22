import { Request, Response } from "express";
import { Todo } from "./todo.model";
import { asyncResult } from "../utils/results";

export class TodoController {
  async create(req: Request, res: Response) {
    const { title, isCompleted } = req.body;
    const { user } = res.locals;
    const todo = await Todo.create({ title, isCompleted, userId: user.id });

    //create forward link
    user.todos.push(todo.id);
    await user.save();

    res.status(201).send(todo);
  }

  //Todos/:tid
  async read(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = res.locals;

    const todo = await asyncResult(() => Todo.findById(id));

    if (!todo.ok) {
      return res.status(500).send("INTERNAL SERVER ERROR");
    }

    if (!todo.value) {
      return res.status(404).send("NOT FOUND");
    }

    if (todo.value.userId !== user.id) {
      return res.status(403).send("FORBIDDEN");
    }

    return res.status(200).send(todo.value);
  }

  async readAll(_req: Request, res: Response) {
    const { user } = res.locals;
    const todos = await asyncResult(() => Todo.find({ userId: user.id }));

    if (!todos.ok) {
      return res.status(500).send("INTERNAL SERVER ERROR");
    }

    return res.status(200).send(todos.value);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    const { user } = res.locals;
    const todo = await asyncResult(() =>
      Todo.findOneAndUpdate(
        { _id: id, userId: user.id },
        { title, isCompleted },
        { new: true }
      )
    );

    if (!todo.ok) {
      return res.status(500).send("INTERNAL SERVER ERROR");
    }

    if (!todo.value) {
      return res.status(404).send("NOT FOUND");
    }

    return res.status(200).send(todo.value);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = res.locals;
    const todo = await asyncResult(() =>
      Todo.findOneAndDelete({ _id: id, userId: user.id })
    );

    if (!todo.ok) {
      return res.status(500).send("INTERNAL SERVER ERROR");
    }

    return res.status(203).send(todo.value);
  }
}

export default new TodoController();
