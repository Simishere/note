
var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined,undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',

  // SQLite only
  storage: path.join(__dirname, '../database/database.sqlite') 
});

/*
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
  */


var Note = sequelize.define('note', {
  text: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING
  }
});

// Note.sync()
// Note.drop();
// Note.sync({force: true})
// force: true will drop the table if it already exists
//第一次创建数据库需要，后面屏蔽不需要
// Note.sync({force: true}).then(function () {
//   // Table created
//   return Note.create({
//     text: '<p>1.存在便利贴为黄色</p><p>2.添加便利贴为蓝色</p><p>3.新建便利贴为绿色</p>'
//   });
// });

Note.create({
  text: 'haha'
})



Note.destroy({where:{text:'haha'}}, function(){
  console.log('destroy...')
  console.log(arguments)
})
Note.findAll({raw: true}).then(function(articles) {
  console.log(articles)
})

module.exports = Note;
