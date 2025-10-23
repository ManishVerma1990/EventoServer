import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.config.js";
import { RowDataPacket } from "mysql2";
import { UserSchema, User } from "../validators/validators.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { get } from "http";

// registration, login, authorization
async function register(req: Request, res: Response) {
  const userId = uuidv4();

  const user: User = req.body;
  const validUser: any = UserSchema.safeParse(user);

  if (validUser.success) {
    console.log("Invalid user");
    validUser.error.forEach((element: any) => {
      console.log({ path: element.path, msg: element.messege });
    });
    return;
  }

  const hashed = await bcrypt.hash(user.password, 10);
  //validation code

  try {
    //return error if email already exists
    const [result] = await db.execute<RowDataPacket[]>("SELECT email FROM users WHERE email = ?", [user.email]);
    if (result.length != 0) throw new Error("user with this email already exists");
    const [results] = await db.execute("INSERT INTO USERS (userId, name, email, password, phone) VALUES(?,?,?,?,?);", [
      userId.toString(),
      user.name,
      user.email,
      hashed,
      user.phone,
    ]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
  res.send(user);
}

async function login(req: Request, res: Response) {
  // const user: { email: string; password: string } = req.body;
  // //validation code

  // try {
  //   //return error if email already exists
  //   const [result] = await db.execute<RowDataPacket[]>("SELECT email, password FROM users WHERE email = ?", [user.email]);
  //   if (result.length == 0) throw new Error("user with this email doesn't exists");
  //   if (user.password == result[0].password) console.log("logged in");
  // } catch (err) {
  //   console.log(err);
  // }
  res.send("Logged in successfully");
}

function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Session destroy failed" });
      res.clearCookie("connect.sid"); // remove cookie from browser
      res.json({ message: "Logged out" });
    });
  });
}

function profile(req: Request, res: Response) {
  if (!req.isAuthenticated()) return res.status(401).send("Not logged in");
  res.json(req.user);
}

async function update(req: Request, res: Response) {
  const user = req.body;

  const validUser: any = UserSchema.safeParse(user);

  if (validUser.success) {
    console.log("Invalid user");
    validUser.error.forEach((element: any) => {
      console.log({ path: element.path, msg: element.messege });
    });
    return;
  }
  try {
    const [result] = await db.execute("UPDATE users SET name=?, password=?, phone=? WHERE userId = ?", [
      user.name,
      user.password,
      user.phone,
      user.userId,
    ]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function remove(req: Request, res: Response) {
  // const userId = "ed0e0cc3-58be-41b7-a581-d125640e4d7c";
  try {
    const [result] = await db.execute("DELETE FROM  users WHERE  userId=?", [req.body.userId]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

export async function findUserByEmail(email: string) {
  const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const users = Array.isArray(rows) ? rows : [];
  return users[0];
}

export async function findUserById(id: number) {
  const [rows]: any = await db.query("SELECT * FROM users WHERE userId = ?", [id]);
  const users = Array.isArray(rows) ? rows : [];
  return users[0];
}

async function getUsersByEventId(req: Request, res: Response) {
  try {
    const [result] = await db.execute(
      "SELECT u.userId, u.name, u.email, u.phone, r.registeredAt FROM users u JOIN registrations r ON u.userId = r.userId WHERE r.eventId = ?",
      [req.params.id]
    );
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

export default { register, login, logout, profile, update, remove, getUsersByEventId };
