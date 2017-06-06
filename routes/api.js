var express = require('express');
var router = express.Router();
// var myNotes = {};
var Note = require('../models/note');//MVC中的M，操作数据库

/* 获取所有的 notes */

router.get('/notes', function(req, res, next) {
  var opts = {raw: true};//数据库会自动在每条数据前加一个id，后面加创建时间和更新时间，用{raw: true}参数让数据库只返回裸数据
  if(req.session && req.session.user){
    opts.where = {uid:req.session.user.id }
  }

  Note.findAll(opts).then(function(notes) {
    console.log('Note.findAll---',notes);
    res.send({status: 0, data: notes});
  }).catch(function(){
    res.send({ status: 1,errorMsg: '数据库异常'});
  });
});

/*新增note*/
router.post('/notes/add', function(req, res, next){
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }

  console.log(req.body.note);
  console.log(req.body);
  // console.log(req.session.user.id);

  if (!req.body.note) {
    return res.send({status: 2, errorMsg: '内容不能为空'});
  }
  var note = req.body.note;
  var uid = req.session.user.id;
 //console.log({text: note, uid: uid})
  console.log(note);
  // console.log(uid);
  Note.create({text: note, uid: uid}).then(function(){
    // console.log(arguments, '--------');
    // console.log(arguments[0].dataValues.id, '--------');
    res.send({status: 0, id: arguments[0].dataValues.id});
  }).catch(function(){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

/*修改note*/
router.post('/notes/edit', function(req, res, next){
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }
  var noteId = req.body.id;
  var note = req.body.note;
  var uid = req.session.user.id;
  console.log(noteId,'---------2')
  Note.update({text: note}, {where:{id: noteId, uid: uid}}).then(function(lists){
    if(lists[0] === 0){
      return res.send({ status: 1,errorMsg: '你没有权限'});
    }
    res.send({status: 0});
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

/*删除note*/
router.post('/notes/delete', function(req, res, next){
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }

  var noteId = req.body.id
  var uid = req.session.user.id;
  console.log(noteId,'---------3')
  Note.destroy({where:{id:noteId, uid: uid}}).then(function(deleteLen){
    if(deleteLen === 0){
      return res.send({ status: 1,errorMsg: '你没有权限'});
    }
    res.send({status: 0});
  }).catch(function(e){
    res.send({ status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

module.exports = router;
