var express = require('express');
var router = express.Router();
const User = require('../../models/user');

router.post('/', async function(req, res, next) {
  let message = []
  if(req.body[0].role === 'student'){
    message = [{
      username: req.body[0].username,
      password: req.body[0].password,
      role: req.body[0].role,
      canApply: 1, 
      canTake: 1,
      canRelease: 0,
      canRecruit: 0,
      introduction: '',
      collectionFolder:'[{"id":1,"label":"默认","children":[]}]'
    },{click: req.body[1].click}];
  }else{
    message = [{
      username: req.body[0].username,
      password: req.body[0].password,
      role: req.body[0].role,
      canApply: 0, 
      canTake: 0,
      canRelease: 1,
      canRecruit: 1,
      introduction: '',
      collectionFolder:''
    },{click: req.body[1].click}];
  }
  // console.log(message);
  let isexist 
  await User.findAll({
    where:{
      username: req.body[0].username,
    },
    raw: true
  }).then((res) => {
    isexist = res[0];
  });
  res.send(typeof isexist)
  if(req.body[1].click === '1'){ //点击了注册按钮
    User.create(message[0]).then(function() {
      
    }).catch(function(err) {
      console.error(err);
      throw err;
    }) 
  }
});

module.exports = router;