var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const Allprojects = require('../../models/all-project');

router.post('/', async function(req, res, next) {
  let keyresult
  console.log(req.body.key);
  if (req.body.who.role === 'student') {
    if(req.body.key === 'tab-all'){
      await Allprojects.findAll({
        where:{
          whoTake: req.body.who.username
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if (req.body.key === 'tab-sub') {
      await Allprojects.findAll({
        where:{
          whoTake: req.body.who.username,
          status: 1
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if (req.body.key === 'tab-eva') {
      await Allprojects.findAll({
        where:{
          [Sequelize.Op.or]: [
            {
              whoTake: req.body.who.username,
              status: 2
            },
            {
              whoTake: req.body.who.username,
              status: 3
            }
          ]
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if(req.body.key === 'tab-done') {
      await Allprojects.findAll({
        where:{
          whoTake: req.body.who.username,
          status: 4
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }
  }else if (req.body.who.role === 'company') { //公司
    if(req.body.key === 'tab-all'){
      await Allprojects.findAll({
        where:{
          whoRelease: req.body.who.username,
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if (req.body.key === 'tab-sub') {
      await Allprojects.findAll({
        where:{
          whoRelease: req.body.who.username,
          status:1,
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if (req.body.key === 'tab-eva') {
      await Allprojects.findAll({
        where:{
          [Sequelize.Op.or]: [
            {
              whoRelease: req.body.who.username,
              status: 2
            },
            {
              whoRelease: req.body.who.username,
              status: 3
            }
          ]
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }else if(req.body.key === 'tab-done') {
      await Allprojects.findAll({
        where:{
          whoRelease: req.body.who.username,
          status: 4
        },
        raw: true
      }).then((res) => {
       keyresult = res
      });
    }
  }
  res.send(keyresult)
  keyresult = undefined
})

module.exports = router;