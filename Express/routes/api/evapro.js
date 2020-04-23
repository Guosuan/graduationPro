var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');

router.post('/', async function(req, res, next) {
  if(req.body.who.role === 'student'){
    await Allprojects.update(
      {
        studentEvaluation: req.body.eva,
        status: 4,
      },
      {
        where: {
          projectName: req.body.proname
        }
      }
    )
    res.send('评价完成')
  }else {
    await Allprojects.update(
      {
        companyEvaluation: req.body.eva,
        status: 3,
      },
      {
        where: {
          projectName: req.body.proname
        }
      }
    )
    res.send('评价完成')
  }
})

module.exports = router;