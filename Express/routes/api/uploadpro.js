var express = require('express');
var router = express.Router();
const Allprojects = require('../../models/all-project');
const multer = require('multer');

var f 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload');
  },
  filename: function (req, file, cb) {
    const filenameArr = file.originalname.split('.');
    cb(null, req.body.filename+'.'+filenameArr[filenameArr.length-1]);
    f = req.body.filename+'.'+filenameArr[filenameArr.length-1]
  }
});

var upload = multer({ storage: storage })
router.post('/',upload.single('file'), async function(req, res, next) {
  Allprojects.update(
    {
      proPath:req.file.path,
      filename:f,
      status:2
    },
    {
      where:{
        projectName:req.body.filename 
      }
    }
  );
  res.send('上传成功')
})

module.exports = router;