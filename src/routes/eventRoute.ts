import { Router } from "express";
import eventController from "../controllers/event.js";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  eventController.listEvents(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  eventController.getEventById(req, res);
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

router.get("/:id/participants", (req: Request, res: Response) => {
  eventController.getParticipants(req, res);
});

router.get("/organizer/:organizerId", (req: Request, res: Response) => {
  eventController.getEventsByOrganizerId(req, res);
});

export default router;
