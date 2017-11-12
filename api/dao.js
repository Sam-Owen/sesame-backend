
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/sesame-db'; // 数据库为 sesame-db

/**
@函数式编程
创建Promise包装过的链式调用CRUD服务
*/
let CRUDFactory = table => {
    let crud = [],
        operation = table.__proto__;
    for (var i in operation) {
        if (operation.hasOwnProperty(i)) { 
            crud.push(i);
        };
    }
    let service = {};
    crud.forEach(operation => {
        service[operation] = (...para) => {
            return new Promise((resolve, reject) => {
                let callback = (err, result) => {
                    if (err) {
                        console.error('Error:' + err);
                        reject(err);
                    } else {
                        console.log(`${operation}成功`);
                        resolve(result);
                    }
                }
                para.push(callback)
                if (operation === 'find') {
                    table.find(para.length > 1 ? para[0] : {}).toArray(callback);
                } else {
                    table[operation].apply(table, para)
                }
            });
        }
    })
    return service;
}

/**
@函数式编程
注册基础服务
*/
let register = (tableName) => {
    if (global.DB_CONNECT) {
        return global.DB_CONNECT.then(() => {
            return new Promise((resolve, reject) => {
                resolve(CRUDFactory(global.DB.collection(tableName)));
            })
        })
    }
    global.DB_CONNECT = new Promise((resolve, reject) => {
        MongoClient.connect(DB_CONN_STR, (err, db) => {
            if (err) {
                console.error('Error:' + err);
                reject();
            } else {
                console.log("mongodb连接成功！");
                global.DB = db;
                resolve(CRUDFactory(global.DB.collection(tableName)));
            }
        });
    })
    return global.DB_CONNECT;
}

module.exports = {
    register
}