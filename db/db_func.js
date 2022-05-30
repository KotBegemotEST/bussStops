const mysql = require("mysql")
var pool = require('mysqlConnector');
const connection = mysql.createPool({

    host:"localhost",
    user:"root",
    password:"",
    database:"bussstops"
})  


async function readStops() {
        const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM stops"
        connection.query(query, (err, results) => {
            if(err) reject(new Error(err.message));
                // console.log(results);
                resolve(results);
            });



        })
    };

function getRegions() {
    return new Promise((resolve, reject) => {
        const query = "SELECT stops.zone_name FROM stops GROUP BY zone_name;"
        connection.query(query, (err, results) => {
            if (err) reject(new Error(err.message));
            console.log(results)
            resolve(results);

        });
    })
};


module.exports = {readStops,getRegions}