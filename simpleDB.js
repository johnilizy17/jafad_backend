const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
}

class SimpleDB {
    static readDB() {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    }

    static writeDB(data) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }

    static findOne(collection, query) {
        const db = this.readDB();
        return db[collection]?.find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }

    static find(collection, query = {}) {
        const db = this.readDB();
        if (Object.keys(query).length === 0) {
            return db[collection] || [];
        }
        return db[collection]?.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        }) || [];
    }

    static create(collection, data) {
        const db = this.readDB();
        if (!db[collection]) {
            db[collection] = [];
        }
        const newItem = {
            _id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db[collection].push(newItem);
        this.writeDB(db);
        return newItem;
    }

    static updateOne(collection, query, update) {
        const db = this.readDB();
        const index = db[collection]?.findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
        
        if (index !== -1) {
            db[collection][index] = {
                ...db[collection][index],
                ...update,
                updatedAt: new Date().toISOString()
            };
            this.writeDB(db);
            return db[collection][index];
        }
        return null;
    }

    static deleteOne(collection, query) {
        const db = this.readDB();
        const index = db[collection]?.findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
        
        if (index !== -1) {
            db[collection].splice(index, 1);
            this.writeDB(db);
            return true;
        }
        return false;
    }

    static count(collection, query = {}) {
        return this.find(collection, query).length;
    }
}

module.exports = SimpleDB;
