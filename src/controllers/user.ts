import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.config.js";
// import type { User } from "../../../shared/types.ts";
import { RowDataPacket } from "mysql2";
import { UserSchema, User } from "../validators/validators.js";

async function getUserIdByEmail(email: String) {
  try {
    const [result] = await db.execute("SELECT userId FROM users WHERE email = ?", [email]);
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function newUser(req: Request, res: Response) {
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
  //validation code

  try {
    //return error if email already exists
    const [result] = await db.execute<RowDataPacket[]>("SELECT email FROM users WHERE email = ?", [user.email]);
    if (result.length != 0) throw new Error("user with this email already exists");
    const [results] = await db.execute("INSERT INTO USERS (userId, name, email, password, phone) VALUES(?,?,?,?,?);", [
      userId.toString(),
      user.name,
      user.email,
      user.password,
      user.phone,
    ]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
  res.send(user);
}

async function login(req: Request, res: Response) {
  const user: { email: string; password: string } = req.body;
  //validation code

  try {
    //return error if email already exists
    const [result] = await db.execute<RowDataPacket[]>("SELECT email, password FROM users WHERE email = ?", [user.email]);
    if (result.length == 0) throw new Error("user with this email doesn't exists");
    if (user.password == result[0].password) console.log("logged in");
  } catch (err) {
    console.log(err);
  }
  res.send(user);
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

export default { newUser, login, update, remove };
