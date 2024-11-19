const { MongoClient } = require('mongodb');
const config = require('../config');

let db = null;

async function connectDB() {
    try {
        const client = await MongoClient.connect(config.DATABASE_URL);
        db = client.db('veterinary');
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

module.exports = {
    connectDB,
    getDB
};