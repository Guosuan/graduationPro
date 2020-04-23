var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');
var path = require('path');


router.post('/',async function(req, res, next) {
  let result
  await Allprojects.findAll({
    where:{
      projectName: req.body.proname
    },
    raw: true
  }).then((res) => {
    result = res
  });
  
  res.download(path.join(__dirname,"../../upload/"+result[0].filename),result[0].filename,function(err){
    if (err) {
      console.log(err);
    } else {
    }
  })
})

module.exports = router;