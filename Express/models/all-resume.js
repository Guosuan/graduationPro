var Sequelize = require('sequelize');
var Mysql = require('../config/db');

const Allresume = Mysql.define('Allresume',{
  positionName: {
    type: Sequelize.CHAR(30),
    allowNull: false,
  },
  companyName: {
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  stuname: {
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  resumePath: {
    type: Sequelize.CHAR(255),
    allowNull: false
  },
  filename:{
    type: Sequelize.CHAR(255),
    allowNull: false,
    primaryKey: true
  }
},
{
  timestamps: false,
})

module.exports = Allresume;