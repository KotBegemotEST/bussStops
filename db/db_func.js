const mysql = require("mysql")
var pool = require('mysqlConnector');
const connection = mysql.createPool({

    host:"d26893.mysql.zonevs.eu",
    user:"d26893_busstops",
    password:"3w7PYquFJhver0!KdOfF",
    database:"d26893_busstops"
})  


async function readStops() {
        const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM antonBuketov_busStops"
        connection.query(query, (err, results) => {
            if(err) reject(new Error(err.message));
                // console.log(results);
                resolve(results);
            });



        })
    };

function getRegions() {
    return new Promise((resolve, reject) => {
        const query = "SELECT stops.zone_name FROM antonBuketov_busStops GROUP BY zone_name;"
        connection.query(query, (err, results) => {
            if (err) reject(new Error(err.message));
            console.log(results)
            resolve(results);

        });
    })
};


module.exports = {readStops,getRegions}