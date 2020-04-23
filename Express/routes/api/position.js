var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const Allposition = require('../../models/all-position');
const Allresume = require('../../models/all-resume');
var path = require('path');

router.post('/', async function(req, res, next) {
  let result
  if(req.body.op === 'recruit'){ //发布招聘信息
    await Allposition.findAll({
      where: {
        positionName:req.body.posname,
        companyName: req.body.comname,
      },
      raw: true
    }).then(async res => {
      if (typeof res[0] === 'undefined'){
        await Allposition.create({
          positionName:req.body.posname,
          companyName: req.body.comname,
          positionIntroduction:req.body.positionIntr,
          positiontRequirement:req.body.positiontReq,
          status: 0
        }).then(() => {
          result = '发布成功'
        }).catch(err => {
          console.log(err);
        })
      }else{
        result = '职位已发布'
      }
    })
    res.send(result)
  }else if(req.body.op === 'keysearch'){ //搜索职位
    await Allposition.findAll({
      where:{
        [Sequelize.Op.or]: [
          {
            companyName:{
              [Sequelize.Op.like]: '%'+req.body.keyword+'%'
            },
            status: 0  
          },
          {
            positionName:{
              [Sequelize.Op.like]: '%'+req.body.keyword+'%'
            },
            status: 0 
          },
        ]
      },
      raw: true
    }).then(res => {
      result = res
    }).catch(err => {
      console.log(err);
    })
    res.send(result)
  }else if(req.body.op === 'getposdata'){ //职位详细界面
    let isapply
    let a 
    console.log(req.body);
    await Allposition.findAll({
      where: {
        positionName:req.body.posname,
        companyName: req.body.comname
      },
      raw: true
    }).then(async res => {
      result = res
      if(req.body.stuname){
      await Allresume.findAll({
          where: {
            positionName:req.body.posname,
            companyName: req.body.comname,
            stuname:req.body.stuname
          },
          raw: true
        }).then(res => {
          isapply = res
          a = typeof isapply[0]
        })
      }
    }).catch(err => {
      console.log(err);
    })
    res.send([result,a])
  }else if(req.body.op === 'showpos'){ //学生展示投递职位、企业展示发布职位
    if(req.body.role === 'student'){
      await Allresume.findAll({
        where: {
          stuname: req.body.username
        }
      }).then(res => {
        result = res
      }).catch(err => {
        console.log(err);
      })
    }else{
      await Allposition.findAll({
        where: {
          companyName: req.body.username
        }
      }).then(res => {
        result = res
      }).catch(err => {
        console.log(err);
      })
    }
    res.send(result)
  }else if(req.body.op === 'posdetail'){
    await Allposition.findAll({
      where: {
        positionName:req.body.posname,
        companyName: req.body.comname,
      }
    }).then(res => {
      result = res
    }).catch(err => {
      console.log(err);
    })
    res.send(result)
  }else if(req.body.op === 'appdetail'){
    await Allresume.findAll({
      where: {
        positionName: req.body.posname,
        companyName:req.body.comname
      }
    }).then(res => {
      result = res
    }).catch(err => {
      console.log(err);
    })
    res.send(result)
  }else if(req.body.op === 'downloadres'){
    await Allresume.findAll({
      where: {
        positionName: req.body.posname,
        companyName:req.body.comname,
        stuname:req.body.stuname
      },
      raw: true
    }).then(res => {
      result = res
    });
    
    res.download(path.join(__dirname,"../../resume/"+result[0].filename),result[0].filename,function(err){
      if (err) {
        console.log(err);
      } else {
      }
    })
  }
  // res.send(result)
})

module.exports = router;