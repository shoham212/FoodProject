const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER], // כתובת ה-Broker מתוך .env
  sasl: {
    mechanism: 'SCRAM-SHA-256', // סוג האימות
    username: process.env.KAFKA_USERNAME, // שם המשתמש מתוך .env
    password: process.env.KAFKA_PASSWORD, // הסיסמה מתוך .env
  },
  ssl: true, // שימוש ב-SSL
});

module.exports = kafka;
