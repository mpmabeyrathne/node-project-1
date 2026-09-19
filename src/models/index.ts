import { User } from "./user.model.js";
import { Room } from "./room.model.js";
import { Booking } from "./booking.model.js";
import { Payment } from "./payment.model.js";

User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Room.hasMany(Booking, {
  foreignKey: "roomId",
  as: "bookings",
});

Booking.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

Booking.hasOne(Payment, {
  foreignKey: "bookingId",
  as: "payment",
});

Payment.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});

export {
  User,
  Room,
  Booking,
  Payment,
};