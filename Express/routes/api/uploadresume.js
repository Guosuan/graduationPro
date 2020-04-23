var express = require('express');
var router = express.Router();
const Allresume = require('../../models/all-resume');
const multer = require('multer');

var f 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'resume');
  },
  filename: function (req, file, cb) {
    const filenameArr = file.originalname.split('.');
    cb(null, req.body.filename+'.'+filenameArr[filenameArr.length-1]);
    f = req.body.filename+'.'+filenameArr[filenameArr.length-1]
  }
});
var upload = multer({ storage: storage })

router.post('/',upload.single('file'), async function(req, res, next) {
  let result
  await Allresume.create({
    positionName:req.body.posname,
    companyName:req.body.comname,
    stuname:req.body.stuname,
    resumePath:req.file.path,
    filename:f,
  }).then(() => {
    result = '上传成功'
  }).catch(err => {
    console.log(err);
  })
  res.send(result)
})

module.exports = router;