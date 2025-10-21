import { Router } from "express";
import eventController from "../controllers/event.js";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  eventController.listEvents(req, res);
});

router.post("/new", (req: Request, res: Response) => {
  eventController.newEvent(req, res);
});

router.put("/update", (req: Request, res: Response) => {
  eventController.update(req, res);
});

router.delete("/delete", (req: Request, res: Response) => {
  eventController.remove(req, res);
});

export default router;
