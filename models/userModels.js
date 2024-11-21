const { sql } = require('../config/db');

const checkUser = async (username) => {
    const result = await sql.query`SELECT * FROM users WHERE username = ${username}`;
    return result.recordset[0];
};

const createUser = async (username, hashedPassword) => {
    await sql.query`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`;
};

module.exports = { checkUser, createUser };
