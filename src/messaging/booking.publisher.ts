import {
    getRabbitMQChannel,
  } from "../config/index.js";
  
  import {
    BOOKING_CONFIRMED_KEY,
    BOOKING_EXCHANGE,
  } from "./rabbitmq.constants.js";
  
  interface BookingConfirmedEvent {
    bookingId: number;
    paymentId: number;
    userId: number;
    roomId: number;
  }
  
  export function publishBookingConfirmed(
    event: BookingConfirmedEvent,
  ) {
    const channel =
      getRabbitMQChannel();
  
    const message = Buffer.from(
      JSON.stringify(event),
    );
  
    channel.publish(
      BOOKING_EXCHANGE,
      BOOKING_CONFIRMED_KEY,
      message,
      {
        contentType: "application/json",
        persistent: true,
      },
    );
  
    console.log(
      "Published booking.confirmed:",
      event,
    );
  }