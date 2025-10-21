import express from "express";
import { Request, Response } from "express";
import userController from "../controllers/user.js";

const router = express.Router();

router.post("/new", (req: Request, res: Response) => {
  userController.newUser(req, res);
});

router.get("/login", (req: Request, res: Response) => {
  userController.login(req, res);
});

router.put("/update", (req: Request, res: Response) => {
  userController.update(req, res);
});

router.delete("/delete", (req:Request, res:Response)=>{
  userController.remove(req,res)
})

export default router;
