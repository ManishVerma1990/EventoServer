import { v4 as uuidv4 } from "uuid";
import db from "../config/db.config.js";
// import type { Event } from "../../../shared/types.ts";
import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { EventSchema, Event } from "../validators/validators.js";
import { formatDate } from "../utils/formatDate.js";

async function listEvents(req: Request, res: Response) {
  try {
    const [result] = await db.execute("SELECT * FROM events");
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
  console.log("list event");
}

async function newEvent(req: Request, res: Response) {
  const eventId = uuidv4();
  const organizerId = "ed0e0cc3-58be-41b7-a581-d125640e4d7c";

  const event: Event = req.body;
  const validEvent: any = EventSchema.safeParse(event);

  if (validEvent.success) {
    console.log("Invalid Event");
    validEvent.error.forEach((element: any) => {
      console.log({ path: element.path, msg: element.messege });
    });
    return;
  }
  //validation code

  try {
    //return error if email already exists
    const [result] = await db.execute<RowDataPacket[]>(
      "INSERT INTO events (eventId, organizerId, title, description, category, address, startTime, endTime, capacity, price) VALUES(?,?,?,?,?,?,?,?,?,?)",
      [
        eventId,
        event.organizerId,
        event.title,
        event.description,
        event.category,
        event.address,
        formatDate(event.startTime),
        formatDate(event.endTime),
        event.capacity,
        event.price,
      ]
    );
    console.log("added event");
  } catch (err) {
    console.log(err);
  }
  res.send("new event");
}

async function update(req: Request, res: Response) {
  const event = req.body;
  const validEvent: any = EventSchema.safeParse(event);

  if (validEvent.success) {
    console.log("Invalid Event");
    validEvent.error.forEach((element: any) => {
      console.log({ path: element.path, msg: element.messege });
    });
    return;
  }

  try {
    const [result] = await db.execute(
      "UPDATE events SET  title= ?, description= ?, category= ?, address= ?, startTime= ?, endTime= ?, capacity= ?, price= ? WHERE eventId = ?",
      [
        event.title,
        event.description,
        event.category,
        event.address,
        formatDate(event.startTime),
        formatDate(event.endTime),
        event.capacity,
        event.price,
        event.eventId,
      ]
    );
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const [result] = await db.execute("DELETE FROM events WHERE eventId = ?", [req.body.eventId]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

export default { newEvent, listEvents, update, remove };
