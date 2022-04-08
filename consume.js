const fs = require('fs')
const { Kafka } = require("kafkajs")

const topic = process.env.KAFKA_TOPIC_DEMO_ENG_TOPIC
const cacrt = process.env.KAFKA_USER_CA_CRT
const userkey = process.env.KAFKA_USER_KEY
const usercrt = process.env.KAFKA_USER_CRT

const kafka = new Kafka({
  clientId: 'demo-eng-consumer-0',
  brokers: [process.env.KAFKA_BOOTSTRAP_HOST],
  ssl: {
    ca: [fs.readFileSync(cacrt, 'utf-8')],
    key: fs.readFileSync(userkey, 'utf-8'),
    cert: fs.readFileSync(usercrt, 'utf-8')
  },
})

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID })

const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
	    eachMessage: async ({ topic, partition, message, heartbeat }) => {
	        console.log({
		    partition: partition,
	            key: message.key.toString(),
	            value: message.value.toString(),
	        })
	    },
	})
}


// start the consumer, and log any errors
consume().catch((err) => {
	console.error("error in consumer: ", err)
})
