var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const Allprojects = require('../../models/all-project');

router.post('/', async function(req, res, next) {
  let keyresult
  await Allprojects.findAll({
    where:{
      [Sequelize.Op.or]: [ //相当于SQL的 OR
        {
          whoRelease:{
            [Sequelize.Op.like]: '%'+req.body.keyword+'%' //相当于SQL的 LIKE '%xxx%' AND 
          },
          status: 0  
        },
        {
          projectName:{
            [Sequelize.Op.like]: '%'+req.body.keyword+'%'
          },
          status: 0 
        },
      ]
    },
    raw: true
  }).then((res) => {
   keyresult = res
  });
  res.send(keyresult)
})

module.exports = router;