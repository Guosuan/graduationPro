var Sequelize = require('sequelize');
var Mysql = require('../config/db');
// const Allprojects = require('../../models/all-project');

const Stucollection = Mysql.define('stucollection',{
  stuname: {
    type: Sequelize.CHAR(10),
    allowNull: false
  },
  proname: { 
    type: Sequelize.CHAR(30),
    allowNull: false
  },
  path: {
    type: Sequelize.CHAR(255),
    allowNull: false
  }
},
{
  timestamps: false,
})

// Stucollection.belongsTo(Allprojects,{as: 'allpro',foreignKey: 'proname',targetKey: 'projectName'})
// Stucollection.sync().then(function(){
//   console.log('同步成功');
// });

module.exports = Stucollection;