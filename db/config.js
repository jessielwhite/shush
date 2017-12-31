// const config = require('../config');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
// db password: NC8Jo8GGBp6CodbP
// initialize proxy: indigovalley-shush:us-central1:iv-shush
const sequelize = new Sequelize('shush', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// define user table
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

User.generateHash = function(password) {
  return bcrypt.hash(password, bcrypt.genSaltSync(8));
};

User.prototype.validPassword = function(password) {
  return bcrypt.compare(password, this.password);
};
  
User.sync();

const Moment = sequelize.define('moment', {
  dbChange: Sequelize.INTEGER,
  timestamp: Sequelize.DATE,
});

Moment.belongsTo(User, { foreignKey: 'id_user' });
Moment.sync();

const Trigger = sequelize.define('trigger', {
  gate: Sequelize.INTEGER,
  duration: Sequelize.INTEGER,
  message: Sequelize.STRING,
});

Trigger.belongsTo(User, { foreignKey: 'id_user' });

const Event = sequelize.define('event', {
  timestamp: Sequelize.DATE,
});

Event.belongsTo(Trigger, { foreignKey: 'id_trigger' });
Event.sync();

const Channel = sequelize.define('channel', {
  name: Sequelize.STRING,
});

const Channel_Trigger = sequelize.define('channel_trigger', {
});

Channel.belongsToMany(Trigger, { through: Channel_Trigger });
Trigger.belongsToMany(Channel, { through: Channel_Trigger });
Channel_Trigger.sync();
Trigger.sync();
Channel.sync();


module.exports = {
  User,
  Moment,
  Trigger,
  Event,
  Channel,
  Channel_Trigger,
}