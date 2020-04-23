var Sequelize = require('sequelize');
var Mysql = require('../config/db');

const Allprojects = Mysql.define('allproject',{
  projectName: { //项目名称
    type: Sequelize.CHAR(30),
    allowNull: false,
  },
  whoRelease: { //发布任务的人
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  whoTake: { //接受任务的人
    type: Sequelize.CHAR(10),
  },
  projectIntroduction: { //项目介绍
    primaryKey: true,
    type: Sequelize.CHAR(255),
    allowNull: false,
  },
  projectRequirement: { //项目要求
    type: Sequelize.CHAR(255),
    allowNull: false,
  },
  status: { //状态（已发布、已被接受、已提交待评价、已完成）
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  studentEvaluation: { //学生评价项目
    type: Sequelize.CHAR(255),
  },
  companyEvaluation: { //企业评价项目
    type: Sequelize.CHAR(255),
  },
  proPath: {
    type: Sequelize.CHAR(255),
  },
  filename:{
    type: Sequelize.CHAR(255),
  }
},
{
  timestamps: false,
})

// Allprojects.belongsTo(Stucollection,{as: 'stucol',foreignKey: 'projectName',targetKey: 'proname'})
// Allprojects.sync().then(function(){
//   console.log('同步成功');
// });
module.exports = Allprojects;