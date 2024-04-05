var express=require("express");

const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
var cors=require("cors");

const port = process.env.PORT || 5000;

try{
  connectDb();
}
catch(err){
  console.log("Errror on DB Connection \nPlease change connection string or add your ip to mongodb server");
}

var app=express()
app.set('view engine', 'ejs');
app.set('views','./views');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use('/api', require("./routes/userRoutes"));
app.use('/', require("./routes/authRoutes"));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



//run nodemon  psmr
//npm run dev
