var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');

router.post('/', async function(req, res, next) {
  let keyresult
  console.log(req.body);
  await Allprojects.findAll({
    where:{
      projectName: req.body.proname
    },
    raw: true
  }).then((res) => {
   keyresult = res
  });
  console.log(typeof keyresult[0]);
  
  if (typeof keyresult[0] === 'undefined') {
    Allprojects.create({
      projectName:req.body.proname,
      whoRelease: req.body.whorelease,
      whoTake:'',
      projectIntroduction: req.body.prointroduction,
      projectRequirement: req.body.proreqirement,
      status:0,
      studentEvaluation: '',
      companyEvaluation: '',
      proPath: '',
      filename: ''
    }).then(function() {
      res.send('发布成功')
    }).catch(function(err) {
      console.error(err);
      throw err;
    }); 
  } else {
    res.send('该项目已存在')
  }
})

module.exports = router;