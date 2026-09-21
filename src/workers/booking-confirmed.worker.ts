import amqp from "amqplib";

import { env } from "../config/env.js";

import {
  BOOKING_CONFIRMED_QUEUE,
} from "../messaging/rabbitmq.constants.js";

interface BookingConfirmedEvent {
  bookingId: number;
  paymentId: number;
  userId: number;
  roomId: number;
}

async function startWorker() {
  const connection =
    await amqp.connect(
      env.RABBITMQ_URL,
    );

  const channel =
    await connection.createChannel();

  await channel.assertQueue(
    BOOKING_CONFIRMED_QUEUE,
    {
      durable: true,
    },
  );

  channel.prefetch(1);

  console.log(
    "Booking confirmation worker waiting...",
  );

  await channel.consume(
    BOOKING_CONFIRMED_QUEUE,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const event =
          JSON.parse(
            message.content.toString(),
          ) as BookingConfirmedEvent;

        console.log(
          "Received booking.confirmed:",
          event,
        );

        console.log(
          `Sending confirmation for booking ${event.bookingId}`,
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 1000),
        );

        console.log(
          `Confirmation processed for booking ${event.bookingId}`,
        );

        channel.ack(message);
      } catch (error) {
        console.error(
          "Failed to process message:",
          error,
        );

        channel.nack(
          message,
          false,
          false,
        );
      }
    },
    {
      noAck: false,
    },
  );
}

startWorker().catch((error) => {
  console.error(
    "Worker failed:",
    error,
  );

  process.exit(1);
});