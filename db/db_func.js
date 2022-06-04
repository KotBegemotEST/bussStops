const mysql = require("mysql")
var pool = require('mysqlConnector');
const connection = mysql.createPool({

    host:"localhost",
    user:"root",
    password:"",
    database:"bussstops"
})  

function tConvert2 (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }




async function readStops() {
        const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM stops"
        connection.query(query, (err, results) => {
            if(err) reject(new Error(err.message));
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
    let flag = false
    try{
        return new Promise((resolve, reject) => {
            const query =
            "SELECT st.departure_time, t.direction_code, t.trip_long_name,r.route_short_name,s.stop_name, 'today' as day \
            FROM stops s, stop_times st, trips t, routes r \
            WHERE s.stop_id = st.stop_id AND \
            st.trip_id = t.trip_id AND \
            t.route_id = r.route_id AND \
            s.stop_name = ? AND \
            s.stop_area = ? AND \
            st.departure_time > TIME(?) AND\
            r.route_short_name = ?  \
            GROUP BY st.departure_time LIMIT 5";

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