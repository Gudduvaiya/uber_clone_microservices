import rabbitMQ from "amqplib";

let channel, connection;

export async function connectToAMQP() {
  connection = await rabbitMQ.connect(process.env.RABBIT_URI);
  channel = await connection.createChannel();
  console.log("Connected with Rabbit MQ!");
}

export async function subscribeToQueue(queueName, callback) {
  if (!channel) await connectToAMQP();
  await channel.assertQueue(queueName);
  channel.consume(queueName, (message) => {
    callback(message.content.toString());
    channel.ack(message);
  });
}

export async function publishToQueue(queueName, data) {
  if (!channel) await connectToAMQP();
  console.log(channel);

  await channel.assertQueue(queueName);

  channel.sendToQueue(queueName, Buffer.from(data));
}
