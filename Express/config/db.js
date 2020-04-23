var express = require('express');
var Sequelize = require('sequelize');//引入Sequelize

var Mysql = new Sequelize('user_sql', 'root', '971223', {
    host: 'localhost', //数据库服务器ip
    dialect: 'mysql', //数据库使用mysql
    port: 3306, //数据库服务器端口
});
Mysql.authenticate().then(function(){ //用于验证连接是否成功
    console.log('成了');
}).catch(function(err) {
    console.error(err);
});

module.exports = Mysql;
