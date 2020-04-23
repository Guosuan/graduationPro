var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');

router.post('/', async function(req, res, next) {
  let keyresult
  await Allprojects.findAll({
    where:{
      projectName: req.body.proname,
    },
    raw: true
  }).then((res) => {
   keyresult = res
  });
  res.send(keyresult)
})

module.exports = router;