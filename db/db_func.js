const mysql = require("mysql")
var pool = require('mysqlconnector');
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
                resolve(results);
            });



        })
    };

function getRegions() {
    return new Promise((resolve, reject) => {
        const query = "SELECT antonBuketov_busStops.stop_area FROM antonBuketov_busStops GROUP BY stop_area;"
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
            const query = "SELECT stop_name FROM antonBuketov_busStops WHERE stop_area = ? GROUP BY stop_name ORDER BY stop_name;";

            connection.query(query, [stop_area], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
    } catch (error){
        console.log(error);
    }
}

function getBuses(stop_area,stop_name){
    try {
        return new Promise((resolve, reject) => {
        const query = "SELECT antonBuketov_routes.route_short_name \
        FROM (\
            SELECT antonBuketov_busStops.stop_id, antonBuketov_busStops.stop_name, antonBuketov_stopsTimes.trip_id \
            FROM antonBuketov_busStops \
                Right join antonBuketov_stopsTimes on antonBuketov_stopsTimes.stop_id = antonBuketov_busStops.stop_id \
            WHERE stop_name = ? and stop_area = ?\
            GROUP BY antonBuketov_busStops.stop_id, antonBuketov_busStops.stop_name, antonBuketov_stopsTimes.trip_id \
            ) tab_a \
        LEFT JOIN antonBuketov_trips ON tab_a.trip_id = antonBuketov_trips.trip_id \
        LEFT JOIN antonBuketov_routes ON antonBuketov_routes.route_id = antonBuketov_trips.route_id \
        GROUP BY antonBuketov_routes.route_short_name ORDER BY antonBuketov_routes.route_short_name";
            connection.query(query, [stop_name, stop_area], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            });
        });
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
            as distance FROM antonBuketov_busStops WHERE  \
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
            as distance FROM antonBuketov_busStops WHERE  \
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

    } catch (error){
        console.log(error);
    }
}


// "SELECT st.departure_time, t.direction_code, t.trip_long_name,r.route_short_name,s.stop_name, 'today' as day \
// FROM antonBuketov_busStops s, antonBuketov_stopsTimes st, antonBuketov_trips t, antonBuketov_routes r \
// WHERE s.stop_id = st.stop_id AND \
// st.trip_id = t.trip_id AND \
// t.route_id = r.route_id AND \
// s.stop_name = ? AND \
// s.stop_area = ? AND \
// st.departure_time > TIME(?) AND\
// r.route_short_name = ?  \
// GROUP BY st.departure_time LIMIT 5";


function getTimes(stop_area, stop_name, route_short_name, dep_time) {
    let flag = false
    try{
        return new Promise((resolve, reject) => {
            const query =
            "SELECT * FROM ( \
                SELECT tab_b.* FROM ( \
                SELECT tab_a.stop_id,tab_a.stop_area,tab_a.stop_name,tab_a.departure_time,tab_a.trip_id,antonBuketov_trips.trip_long_name,antonBuketov_routes.route_short_name \
                FROM ( \
                    SELECT antonBuketov_busStops.stop_area, antonBuketov_busStops.stop_id, antonBuketov_busStops.stop_name,antonBuketov_stopsTimes.trip_id, antonBuketov_stopsTimes.departure_time \
                    FROM antonBuketov_busStops RIGHT JOIN antonBuketov_stopsTimes ON antonBuketov_stopsTimes.stop_id = antonBuketov_busStops.stop_id \
                    WHERE stop_name = ? AND stop_area = ? AND antonBuketov_stopsTimes.departure_time >= TIME(?) \
                    GROUP BY antonBuketov_busStops.stop_id, antonBuketov_busStops.stop_name, antonBuketov_stopsTimes.trip_id ) tab_a \
                LEFT JOIN antonBuketov_trips ON tab_a.trip_id = antonBuketov_trips.trip_id \
                LEFT JOIN antonBuketov_routes ON antonBuketov_routes.route_id = antonBuketov_trips.route_id \
                WHERE antonBuketov_routes.route_short_name = ? \
                ORDER BY tab_a.departure_time ) tab_b LIMIT 5) tab_c \
                ORDER BY tab_c.departure_time" ;

            connection.query(query, [stop_name, stop_area,dep_time, route_short_name], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
                
            });

        });

    } catch (error){
        console.log(error);
    }
}


module.exports = {readStops, getRegions, getAllStops,getBuses,getReg,getNearestStops,getTimes}