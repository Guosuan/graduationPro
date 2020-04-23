var Sequelize = require('sequelize');
var Mysql = require('../config/db');

const Allposition = Mysql.define('Allposition',{
  positionName: {
    type: Sequelize.CHAR(30),
    allowNull: false,
  },
  companyName: {
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  positionIntroduction: { 
    type: Sequelize.STRING(500),
    allowNull: false,
  },
  positiontRequirement: { 
    type: Sequelize.STRING(500),
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
},
{
  timestamps: false,
})

module.exports = Allposition;