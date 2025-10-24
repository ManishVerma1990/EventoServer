import express from "express";
import { Request, Response } from "express";
import userController from "../controllers/user.js";
import passport from "passport";
// import "../config/passport.js";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  userController.register(req, res);
});

router.post("/login", passport.authenticate("local"), (req: Request, res: Response) => {
  userController.login(req, res);
});

router.post("/logout", (req: Request, res: Response) => {
  userController.logout(req, res);
});

router.get("/profile", (req: Request, res: Response) => {
  userController.profile(req, res);
});

router.put("/update", (req: Request, res: Response) => {
  userController.update(req, res);
});

router.delete("/delete", (req: Request, res: Response) => {
  userController.remove(req, res);
});

router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user }); // req.user comes from Passport session
  } else {
    res.status(401).json({ user: null });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  userController.getUserById(req, res);
});

router.get("/event/:id", (req: Request, res: Response) => {
  userController.getUsersByEventId(req, res);
});

export default router;
