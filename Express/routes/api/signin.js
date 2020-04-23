var express = require('express');
var router = express.Router();
const User = require('../../models/user');
var jwt = require('jsonwebtoken');

router.post('/',async function(req, res, next){
  let isexist 
  await User.findAll({
    where:{
      username: req.body.username,
    },
    raw: true
  }).then((res) => {
    isexist = res[0];
  });
  if(typeof isexist === 'undefined'){
    res.send('账号不存在')
  }else if(isexist.password !== req.body.password){
    res.send('密码错误')
  }else{
    let token = jwt.sign({name:req.body.username},"secret",{expiresIn : 60*60*24})
    res.send({
      username: isexist.username,
      token: token,
      role:isexist.role,
      message: '登录成功'
    })
  }
});

module.exports = router;