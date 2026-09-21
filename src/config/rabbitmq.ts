import amqp, {
    type Channel,
    type ChannelModel,
  } from "amqplib";
  
  import { env } from "./env.js";
  
  import {
    BOOKING_CONFIRMED_KEY,
    BOOKING_CONFIRMED_QUEUE,
    BOOKING_EXCHANGE,
  } from "../messaging/rabbitmq.constants.js";
  
  let connection: ChannelModel | null = null;
  let publisherChannel: Channel | null = null;
  
  export async function connectRabbitMQ() {
    connection = await amqp.connect(
      env.RABBITMQ_URL,
    );
  
    connection.on("error", (error) => {
      console.error(
        "RabbitMQ connection error:",
        error,
      );
    });
  
    connection.on("close", () => {
      console.warn(
        "RabbitMQ connection closed",
      );
    });
  
    publisherChannel =
      await connection.createChannel();
  
    await publisherChannel.assertExchange(
      BOOKING_EXCHANGE,
      "direct",
      {
        durable: true,
      },
    );
  
    await publisherChannel.assertQueue(
      BOOKING_CONFIRMED_QUEUE,
      {
        durable: true,
      },
    );
  
    await publisherChannel.bindQueue(
      BOOKING_CONFIRMED_QUEUE,
      BOOKING_EXCHANGE,
      BOOKING_CONFIRMED_KEY,
    );
  
    return publisherChannel;
  }
  
  export function getRabbitMQChannel() {
    if (!publisherChannel) {
      throw new Error(
        "RabbitMQ is not connected",
      );
    }
  
    return publisherChannel;
  }