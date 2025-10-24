import { v4 as uuidv4 } from "uuid";
import db from "../config/db.config.js";
import { Request, Response } from "express";
import { RegSchema, Registration } from "../validators/validators.js";
import { get } from "http";

async function checkEventCapacity(eventId: string): Promise<boolean> {
  try {
    const [eventResult]: any = await db.execute("SELECT capacity FROM events WHERE eventId = ?", [eventId]);
    const eventCapacity = eventResult[0]?.capacity || 0;
    const [regResult]: any = await db.execute("SELECT COUNT(*) as regCount FROM registrations WHERE eventId = ?", [eventId]);
    const regCount = regResult[0]?.regCount || 0;
    return regCount < eventCapacity;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function newRegistration(req: Request, res: Response) {
  const regId = uuidv4();

  const reg: Registration = req.body;
  const validReg = RegSchema.safeParse(reg);

  if (!validReg.success) {
    console.log("Invalid registration");
    validReg.error.issues.forEach((issue) => {
      console.log({ path: issue.path, msg: issue.message });
    });
    return res.status(400).send("Invalid registration data");
  }
  if (!(await checkEventCapacity(reg.eventId))) {
    console.log("Event capacity reached");
    return;
  }
  try {
    const [result] = await db.execute(
      "INSERT INTO registrations (regId, eventId, userId, regType, checkIn, paymentStatus ) VALUES(?,?,?,?,?,?)",
      [regId, reg.eventId, reg.userId, reg.regType, reg.checkIn, reg.paymentStatus]
    );
    console.log(result);
    res.send("registration added");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function listRegistrations(req: Request, res: Response) {
  try {
    const [result] = await db.execute("SELECT * FROM registrations");
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

async function update(req: Request, res: Response) {
  const reg = req.body;
  const validReg: any = RegSchema.safeParse(reg);

  if (!validReg.success) {
    console.log("Invalid reg");

    validReg.error.forEach((element: any) => {
      console.log({ path: element.path, msg: element.messege });
    });
    return;
  }
  try {
    console.log(reg);
    const [result] = await db.execute("UPDATE registrations SET regType=?, checkIn=?, paymentStatus=? WHERE regId = ?", [
      reg.regType,
      reg.checkIn,
      reg.paymentStatus,
      reg.regId,
    ]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const [result] = await db.execute("DELETE FROM  registrations WHERE  regId=?", [req.body.regId]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function getRegistrationsByUser(req: Request, res: Response) {
  try {
    const [result] = await db.execute("SELECT * FROM registrations WHERE userId = ?", [req.params.userId]);
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

export default { newRegistration, listRegistrations, update, remove, getRegistrationsByUser };
