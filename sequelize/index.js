
const { Sequelize } = require("sequelize");
const {DBNAME,DBPASS,DBUSER} = require('./secrets.json');


const sequelize = new Sequelize(DBNAME, DBUSER, DBPASS, {
  dialect: "mysql",
  // logQueryParameters: true,
  // benchmark: true
});

const modelDefiners = [require("./models/User.model")];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

sequelize.sync({ force: true });
// sequelize.sync()

module.exports = sequelize;
