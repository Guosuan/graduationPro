var express = require('express');
var router = express.Router();
const User = require('../../models/user');
const Allprojects = require('../../models/all-project');
const Allposition = require('../../models/all-position');
const Stucollection = require('../../models/stu-collect');
const Allresume = require('../../models/all-resume');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');

router.post('/', async function(req, res, next) {
  let result
  if(req.body.activetab){
    if(req.body.activetab === 'tab-stu'){ //管理员查看所有学生
      await User.findAll({
        where: {
          role: 'student'
        },
        raw: true
      }).then((res) => {
        result = res
      });
      
    }else if(req.body.activetab === 'tab-com'){ //管理员查看所有企业
      await User.findAll({
        where: {
          role: 'company'
        },
        raw: true
      }).then((res) => {
        result = res
      });
      
    }
  }else if(req.body.op){ 
    if(req.body.op ==='view'){ //查看用户信息
      await User.findAll({
        where:{
          username: req.body.username,
        },
        raw: true
      }).then((res) => {
        result = res[0]
      });
      
    }else if (req.body.op ==='cannotRe') { //禁止发布项目
      await User.update(
        {
          canRelease: 0
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='canRe') { //允许发布项目
      await User.update(
        {
          canRelease: 1
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='cannotTa') { //禁止接受项目
      await User.update(
        {
          canTake: 0
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='canTa') { //允许接受项目
      await User.update(
        {
          canTake: 1
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='cannotApply') { //禁止投递简历
      await User.update(
        {
          canApply: 0
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='canApply') { //允许投递简历
      await User.update(
        {
          canApply: 1
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='cannotRecruit'){ //禁止发布招聘信息
      await User.update(
        {
          canRecruit: 0
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='canRecruit'){ //允许发布招聘信息
      await User.update(
        {
          canRecruit: 1
        },
        {
          where: {
            username: req.body.username
          }
        }
      );
    }else if (req.body.op ==='changeusername') { //修改用户名
      await User.update(
        {
          username: req.body.username
        },
        {
          where: {
            username: req.body.oriname
          }
        }
      ).then(() => {
        if(req.body.role === 'student'){
          Allprojects.update({
            whoTake:req.body.username
          },{
            where:{
              whoTake:req.body.oriname
            }
          }).then(() => {
            Stucollection.update(
              {
                stuname:req.body.username,
              },
              {
                where:{
                  stuname:req.body.oriname
                }
              }
            ).then(() => {
              Allresume.update(
                {
                  stuname:req.body.username,
                },
                {
                  where:{
                    stuname:req.body.oriname
                  }
                }
              )
            })
          })
        }else{
          Allprojects.update({
            whoRelease:req.body.username
          },{
            where:{
              whoRelease:req.body.oriname
            }
          }).then(() => {
            Allposition.update({
              companyName:req.body.username
            },{
              where:{
                companyName:req.body.oriname
              }
            }).then(() => {
              Allresume.update(
                {
                  companyName:req.body.username,
                },
                {
                  where:{
                    companyName:req.body.oriname
                  }
                }
              )
            })
          })
        }
      })
    }else if (req.body.op ==='isexist') { //用户名是否存在
      await User.findAll({
        where: {
          username: req.body.username
        },
        raw: true
      }).then((res) => {
        result = res[0];
      });
    }else if (req.body.op ==='changepassword') { //修改密码
      await User.update(
        {
          password: req.body.password
        },
        {
          where: {
            username: req.body.username
          }
        }
      )
    }else if(req.body.op ==='changeintroduction'){ //修改简介
      User.update(
        {
          introduction: req.body.introduction
        },
        {
          where: {
            username: req.body.username
          }
        }
      )
    }else if(req.body.op ==='delete'){ //删除用户
      await User.destroy({
        where:{
          username: req.body.username
        },
        force: true
      }).then(() => {
        if(req.body.role === 'company'){
          Allposition.destroy({
            where:{
              companyName: req.body.username
            },
            force: true
          }).then(() => {
            Allresume.findAll({
              where:{
                companyName: req.body.username
              },
              raw: true
            }).then((res) => {
              if(res.length !== 0){
                for(i=0;i<res.length;i++){
                  let uploadpath = path.join(__dirname,"../../resume/"+res[i].filename)
                  fs.unlink(uploadpath, (err) => {
                  if (err) {}
                  });
                }
              }
              Allresume.destroy({
                where:{
                  companyName: req.body.username
                },
                force: true
              }).then(() => {
                Allprojects.findAll({
                  where: {
                    whoRelease: req.body.username
                  },
                  raw: true
                 }).then(res => {
                  for(i=0;i<res.length;i++){
                    if(res[i].filename === ''){
                      Allprojects.destroy({
                        where:{
                          whoRelease: req.body.username
                        },
                        force: true
                      })
                    }else{
                      let uploadpath = path.join(__dirname,"../../upload/"+res[i].filename)
                      fs.unlink(uploadpath, (err) => {
                        if (err) throw err;
                      });
                      Allprojects.destroy({
                        where:{
                          whoRelease: req.body.username
                        },
                        force: true
                      })
                    }
                  }
                })
              })
            })
          })
        }else if(req.body.role === 'student'){
          Stucollection.destroy({
            where:{
              stuname: req.body.username
            },
            force: true
          }).then(() => {
            Allresume.findAll({
              where:{
                stuname: req.body.username
              },
              raw: true
            }).then((res) => {
              if(res.length !== 0){
                for(i=0;i<res.length;i++){
                  let uploadpath = path.join(__dirname,"../../resume/"+res[i].filename)
                  fs.unlink(uploadpath, (err) => {
                  if (err) {}
                  });
                }
              }
              Allresume.destroy({
                where:{
                  stuname: req.body.username
                },
                force: true
              }).then(() => {
                Allprojects.findAll({
                  where: {
                    whoTake: req.body.username
                  },
                  raw: true
                 }).then(res => {
                  for(i=0;i<res.length;i++){
                    if(res[i].filename === ''){
                      Allprojects.update(
                        {
                          whoTake: '',
                          status: 0,
                          studentEvaluation: '',
                          companyEvaluation: '',
                          proPath: '',
                          filename: ''
                        },
                        {
                          where:{
                            whoTake: req.body.username
                          }
                        }
                      )
                    }else{
                      let uploadpath = path.join(__dirname,"../../upload/"+res[i].filename)
                      fs.unlink(uploadpath, (err) => {
                        if (err) throw err;
                      });
                      Allprojects.update(
                        {
                          whoTake: '',
                          status: 0,
                          studentEvaluation: '',
                          companyEvaluation: '',
                          proPath: '',
                          filename: ''
                        },
                        {
                          where:{
                            whoTake: req.body.username
                          }
                        }
                      )
                    }
                  }
                })
              })
            })
          })
          // Allprojects.findAll({
          //   where: {
          //     whoTake: req.body.username
          //   },
          //   raw: true
          // }).then(res => {
          //   for(i=0;i<res.length;i++){
          //     if(res[i].filename === ''){
                // Allprojects.update(
                //   {
                //     whoTake: '',
                //     status: 0,
                //     studentEvaluation: '',
                //     companyEvaluation: '',
                //     proPath: '',
                //     filename: ''
                //   },
                //   {
                //     where:{
                //       whoTake: req.body.username
                //     }
                //   }
                // )
          //     }else{
          //       let uploadpath = path.join(__dirname,"../../upload/"+res[i].filename)
          //       fs.unlink(uploadpath, (err) => {
          //         if (err) throw err;
          //       });
          //       Allprojects.update(
          //         {
          //           whoTake: '',
          //           status: 0,
          //           studentEvaluation: '',
          //           companyEvaluation: '',
          //           proPath: '',
          //           filename: ''
          //         },
          //         {
          //           where:{
          //             whoTake: req.body.username
          //           }
          //         }
          //       )
          //     }
          //   }
          // })
        }
      }).catch(err => {
        console.log(err);
      })
      result = '删除成功'
    }else if(req.body.op ==='editIntr'){ //修改简介
      await User.update(
        {
          introduction: req.body.introduction
        },
        {
          where: {
            username:req.body.username
          }
        }
      )
      result = '编辑成功'
    }else if(req.body.op ==='collect'){ //收藏项目
      if(req.body.role === 'student'){
        console.log(req.body.is);
        if(req.body.is === true){
          await Stucollection.create({
            stuname:req.body.username,
            proname:req.body.proname,
            path:req.body.foldername
          }).then(() => {
            result = '收藏成功'
          }).catch(err => {
            console.log(err);
          })
        }else if(req.body.is === false){
          await Stucollection.destroy({
            where:{
              stuname: req.body.username,
              proname:req.body.proname,
            },
            force: true
          }).then(() => {
            result = '取消收藏'
          }).catch(err => {
            console.log(err);
          })
        }
      }
    }else if(req.body.op ==='viewcollection'){ //查看收藏项目
      if(req.body.role === 'student'){
        await Stucollection.findAll({
          where:{
            stuname: req.body.username,
            path: req.body.foldername
          },
          raw: true
        }).then((res) => {
          result = res
        });
      }
    }else if(req.body.op ==='appendfolder'){ //添加收藏夹
      await User.update(
        {
          collectionFolder:req.body.allfolder
        },
        {
          where: {
            username: req.body.username
          }
        }
      )
    }else if(req.body.op ==='deletefolder'){ //删除收藏夹
      await User.update(
        {
          collectionFolder:req.body.allfolder
        },
        {
          where: {
            username: req.body.username
          }
        }
      ).then(() => {
        // console.log('已更新');
        Stucollection.destroy({
          where:{
            path:{
              [Sequelize.Op.like]: '%'+req.body.path+'%'
            }
          },
          force: true
        }).then(() => {
          // console.log('已删除');
        })
      })
    }else if(req.body.op ==='movecollection'){ //移动收藏项目
      await Stucollection.update(
        {
          path: req.body.path
        },
        {
          where: {
            stuname: req.body.username,
            proname: req.body.proname
          }
        }
      ).then(() => {
        result = '移动成功'
      })
    }
  }else{
    await User.findAll({
      where:{
        username: req.body.username,
      },
      raw: true
    }).then((res) => {
      result = res[0]
    });
  }
  res.send([result ,typeof result])
})

module.exports = router;