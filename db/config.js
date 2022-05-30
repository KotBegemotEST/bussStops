const mysql = require("mysql")
const connection = mysql.createConnetction({

    host:"localhost",
    user:"root",
    password:"",
    database:"bussstops"
})

connection.connect()

// const app = express();
// app.get("/", function(req, res){
//     pool.query("SELECT * FROM users", function(err, data) {
//       if(err) return console.log(err);
//       res.render("index.hbs", {
//           users: data
//       });
//     });
// });