const MongoClient = require('mongodb').MongoClient;
let _db;

const Connection = new MongoClient('mongodb+srv://otmane:ev02xT3qPw2pvLlp@cluster0-yvclq.mongodb.net/shop?retryWrites=true',{ useNewUrlParser: true });
const MongoConnection = callback => {
    Connection.connect()
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback()
        })
        .catch(err => {throw err});
}

const getDb = () => {
    if(_db) return _db;
    throw 'No database is selected';
}

exports.MongoConnection = MongoConnection;
exports.DB = getDb;