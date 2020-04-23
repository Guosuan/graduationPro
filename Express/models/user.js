var Sequelize = require('sequelize');
var Mysql = require('../config/db');

const User = Mysql.define('user',{
  username: { //账号
    type: Sequelize.CHAR(10),
    allowNull: false,
    unique: true, //唯一
    primaryKey: true
  },
  password: { //密码
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  role: { //角色
    type: Sequelize.CHAR(10),
    allowNull: false,
  },
  canTake: { //能否接受任务
    type: Sequelize.INTEGER,
    allowNull: false
  },
  canApply: { //能否投简历
    type: Sequelize.INTEGER,
    allowNull: false
  },
  canRelease: { //能否发布任务
    type: Sequelize.INTEGER,
    allowNull: false
  },
  canRecruit: { //能否发布招聘信息
    type: Sequelize.INTEGER,
    allowNull: false
  },
  introduction: { //简介
    type: Sequelize.CHAR(255),
  },
  collectionFolder: { //收藏夹目录信息
    type: Sequelize.STRING(1000),
  }
},
{
  timestamps: false,
})
//同步模型至数据库 同步过一次后就不需要了
// User.sync().then(function(){
//   console.log('同步成功');
// });

module.exports = User;