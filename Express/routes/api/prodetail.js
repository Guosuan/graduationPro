var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');
const Stucollection = require('../../models/stu-collect');

router.post('/', async function(req, res, next) {
  let keyresult
  let iscol
  if (req.body.op) {
    await Allprojects.findAll({
      where:{
        projectName: req.body.proname,
      },
      raw: true
    }).then(res => {
      keyresult = res
    })
    res.send(keyresult)
  }else{
    await Allprojects.findAll({
      where:{
        projectName: req.body.proname,
        status: 0
      },
      raw: true
    }).then(async (res) => {
      keyresult = res;
      if(req.body.username){
        await Stucollection.findAll({
          where: {
            proname: req.body.proname,
            stuname: req.body.username
          },
          raw: true
        }).then(res => {
          console.log(typeof res[0]);
          if(typeof res[0] === 'undefined'){
            iscol = false
          }else
          iscol = true
        })
      }  
    });
    res.send([keyresult,iscol])
  }
})

module.exports = router;
