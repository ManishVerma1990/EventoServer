import { z } from "zod";

const UserSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9_@]+$/), //should only be numbers and alphabets
  email: z.email(), //just email format
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //should be a number, at least one capital letter, 8char long
  role: z.enum(["user", "organizer", "admin"]),
  phone: z.number().min(1000000000).max(9999999999),
});

type User = z.infer<typeof UserSchema>;

const EventSchema = z.object({
  organizerId: z.string(),
  title: z.string(),
  description: z.string().default(" "),
  category: z.string().default("all"),
  address: z.string(),
  startTime: z.date().min(new Date()),
  endTime: z.date(),
  capacity: z.number(),
  price: z.number().default(0),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"], "invalid status type"),
});

type Event = z.infer<typeof EventSchema>;

const RegSchema = z.object({
  eventId: z.uuidv4(),
  userId: z.uuidv4(),
  regType: z.string(),
  checkIn: z.boolean(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
});

type Registration = z.infer<typeof RegSchema>;

// console.log(userSchema.parse({ name: "manih@123", email: "test@mail.com", password: "s@trinGaaaa4", role: "user", phone: 99999999999999 }));

// console.log(
//   EventSchema.safeParse({
//     title: "some1s@event",
//     // description: z.string().optional().default(" "),
//     // category: z.string(),
//     address: "some,random,123,asddres",
//     startTime: new Date(2025, 8, 4, 12, 0, 0),
//     endTime: new Date(2025, 8, 4, 14, 0, 0),
//     capacity: "dd",
//     // price: z.number().default(0),
//     status: "upcomin",
//   })
// );

export { UserSchema, User, EventSchema, Event, RegSchema, Registration };
