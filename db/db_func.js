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
        const query = "SELECT stops.stop_area FROM stops GROUP BY stop_area;"
        connection.query(query, (err, results) => {
            if (err) reject(new Error(err.message));
            console.log(results)
            resolve(results);
        });
    })
};

function getAllStops(stop_area){
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT stop_name FROM stops WHERE stop_area = ? GROUP BY stop_name ORDER BY stop_name;";

            connection.query(query, [stop_area], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;

    } catch (error){
        console.log(error);
    }
}

function getBuses(stop_area,stop_name){
    try {
        return new Promise((resolve, reject) => {
        const query = "SELECT DISTINCT r.route_short_name\
            FROM stops, stop_times st, trips t, routes r\
            WHERE st.stop_id = stops.stop_id AND \
                  stops.stop_name = ? and \
                  stops.stop_area = ? AND\
                  t.trip_id = st.trip_id AND\
                  r.route_id = t.route_id\
            order by r.route_short_name";
            connection.query(query, [stop_name, stop_area], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;



    } catch (error){
        console.log(error);
    }
}



function getReg(lat,lon) {
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT stop_area, 3956 * 2 *  \
            ASIN(SQRT( POWER(SIN((? - stop_lat)*pi()/180/2),2) \
            +COS(?*pi()/180 )*COS(stop_lat*pi()/180) \
            *POWER(SIN((?-stop_lon)*pi()/180/2),2)))  \
            as distance FROM stops WHERE  \
            stop_lon between (?-0.6/cos(radians(?))*69) \
            and (?+0.6/cos(radians(?))*69) \
            and stop_lat between (?-(0.6/69)) \
            and (?+(0.6/69)) \
            having distance < 0.6 ORDER BY distance limit 1";

            connection.query(query, [lat, lat, lon, lon, lat, lon,lat, lat, lat,], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;

    } catch (error){
        console.log(error);
    }
}

function getNearestStops(lat, lon){
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT stop_name, 3956 * 2 *  \
            ASIN(SQRT( POWER(SIN((? - stop_lat)*pi()/180/2),2) \
            +COS(?*pi()/180 )*COS(stop_lat*pi()/180) \
            *POWER(SIN((?-stop_lon)*pi()/180/2),2)))  \
            as distance FROM stops WHERE  \
            stop_lon between (?-0.6/cos(radians(?))*69) \
            and (?+0.6/cos(radians(?))*69) \
            and stop_lat between (?-(0.6/69)) \
            and (?+(0.6/69)) \
            having distance < 0.6 ORDER BY distance limit 5";

            connection.query(query, [lat, lat, lon, lon, lat, lon,lat, lat, lat,], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;

    } catch (error){
        console.log(error);
    }
}

function getTimes(stop_area, stop_name, route_short_name, dep_time) {
    try{
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM ( \
            SELECT tab_b.* FROM ( \
            SELECT tab_a.stop_id,tab_a.stop_area,tab_a.stop_name,tab_a.departure_time,tab_a.trip_id,trips.trip_long_name,routes.route_short_name \
            FROM ( \
                SELECT stops.stop_area, stops.stop_id, stops.stop_name,stop_times.trip_id, stop_times.departure_time \
                FROM stops RIGHT JOIN stop_times ON stop_times.stop_id = stops.stop_id \
                WHERE stop_name = ? AND stop_area = ? AND stop_times.departure_time >= TIME(?) \
                GROUP BY stops.stop_id, stops.stop_name, stop_times.trip_id ) tab_a \
            LEFT JOIN trips ON tab_a.trip_id = trips.trip_id \
            LEFT JOIN routes ON routes.route_id = trips.route_id \
            WHERE routes.route_short_name = ? \
            ORDER BY tab_a.departure_time ) tab_b LIMIT 5) tab_c \
            ORDER BY tab_c.departure_time" ;

            connection.query(query, [stop_name, stop_area,dep_time, route_short_name], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;

    } catch (error){
        console.log(error);
    }
}


module.exports = {readStops, getRegions, getAllStops,getBuses,getReg,getNearestStops,getTimes}