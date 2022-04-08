const fs = require('fs')
const { Kafka } = require("kafkajs")

const topic = "demo-eng-topic"

fs.readFile('/etc/kafka-auth/user.password', function read(err, data) {
    if (err) {
        throw err;
    }
    const passphrase = data;
});

const kafka = new Kafka({
  clientId: 'demo-eng-producer',
  brokers: ['kafka-kafka-bootstrap.kafka.svc.cluster.local:9093'],
  ssl: {
    ca: [fs.readFileSync('/etc/kafka-ca/ca.crt', 'utf-8')],
    key: fs.readFileSync('/etc/kafka-auth/user.key', 'utf-8'),
    cert: fs.readFileSync('/etc/kafka-auth/user.crt', 'utf-8')
//    passphrase: passphrase
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
