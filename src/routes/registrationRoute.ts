import { Router } from "express";
import regController from "../controllers/registration.js";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  regController.listRegistrations(req, res);
});

router.post("/new", (req: Request, res: Response) => {
  regController.newRegistration(req, res);
});

router.put("/update", (req: Request, res: Response) => {
  regController.update(req, res);
});

router.delete("/delete", (req: Request, res: Response) => {
  regController.remove(req, res);
});

export default router;
