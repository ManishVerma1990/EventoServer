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

async function getEventById(req: Request, res: Response) {
  const eventId = req.params.id;
  try {
    const [result] = await db.execute<RowDataPacket[]>("SELECT * FROM events WHERE eventId = ?", [eventId]);
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

async function newEvent(req: Request, res: Response) {
  const eventId = uuidv4();

  const event: Event = req.body;
  const validEvent: any = EventSchema.safeParse(event);
  console.log(event);

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

async function getParticipants(req: Request, res: Response) {
  console.log("Getting participants for event:", req.params.id);
  try {
    const [result] = await db.execute(
      "SELECT u.userId, u.name, u.email, u.phone FROM users u JOIN registrations r ON u.userId = r.userId WHERE r.eventId = ?",
      [req.params.id]
    );
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

async function getEventsByOrganizerId(req: Request, res: Response) {
  const organizerId = req.params.organizerId;
  try {
    const [result] = await db.execute<RowDataPacket[]>("SELECT * FROM events WHERE organizerId = ?", [organizerId]);
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

async function getEventByName(req: Request, res: Response) {
  try {
    console.log(req.params.name);
    const [result] = await db.execute<RowDataPacket[]>("SELECT * FROM events WHERE title LIKE CONCAT('%', ?, '%')", [req.params.name]);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

export default { newEvent, listEvents, update, remove, getParticipants, getEventById, getEventsByOrganizerId, getEventByName };
