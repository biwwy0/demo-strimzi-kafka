const fs = require('fs')
const { Kafka } = require("kafkajs")

const topic = process.env.KAFKA_TOPIC_DEMO_ENG_TOPIC
const cacrt = process.env.KAFKA_USER_CA_CRT
const userkey = process.env.KAFKA_USER_KEY
const usercrt = process.env.KAFKA_USER_CRT

const kafka = new Kafka({
  clientId: 'demo-eng-producer',
  brokers: [process.env.KAFKA_BOOTSTRAP_HOST],
  ssl: {
    ca: [fs.readFileSync(cacrt, 'utf-8')],
    key: fs.readFileSync(userkey, 'utf-8'),
    cert: fs.readFileSync(usercrt, 'utf-8')
  },
})

const producer = kafka.producer()

const produce = async () => {
  await producer.connect()
  let i = 0

  setInterval(async () => {
    try {
      await producer.send({
        topic,
        messages: [
          {
            key: String(i),
            value: "this is message " + i,
          },
        ],
      })

      console.log("writes: ", i)
      i++
    } catch (err) {
      console.error("could not write message " + err)
    }
  }, 1000)
}

produce().catch((err) => {
  console.error("error in producer: ", err)
})
