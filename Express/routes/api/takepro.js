var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');
const Stucollection = require('../../models/stu-collect');

router.post('/', async function(req, res, next) {
  await Allprojects.update(
    {
      whoTake: req.body.whotake,
      status: 1,
    },
    {
      where: {
        projectName: req.body.proname
      }
    }
  ).then(() => {
    Stucollection.destroy({
      where:{
        stuname: req.body.whotake,
        proname:req.body.proname,
      },
      force: true
    })
  })
  res.send('接受成功')
})

module.exports = router;