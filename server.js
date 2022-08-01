const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require('./sequelize');

const app = express();

const routes = {
  users: require("./routes/users.routes")
};

//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mount routers
app.use("/api/v1/users", routes.users);

//load env vars
dotenv.config({ path: __dirname + "/config.env" });







// initialize db with server.
async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(
    PORT,
    console.log(
      `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );

  //handle unhandled PromeseRejection
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    //Close Server & exit process
    server.close(() => process.exit(1));
  });
}

init();
