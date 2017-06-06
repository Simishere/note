//设计模式中的构造函数模式
require('less/note.less');

var Tips = require('mod/tips.js').Tips;
var Event = require('mod/event.js');

function Note(opts){
  this.initOpts(opts);
  this.createNote();
  this.bindEvent();
}
Note.prototype = {
  colors: [
    ['#3b3ece', '#7578e8'],
    ['#7BE2A7', '#97D0AF']
  ],
  defaultOpts: {
    id: '',   //Note的 id
    $ct: $('#content').length>0?$('#content'):$('body'),  //默认存放 Note 的容器
    context: 'input here'  //Note 的内容
  },

  initOpts: function (opts) {

    this.opts = $.extend({}, this.defaultOpts, opts||{});
    if(this.opts.id){
       this.id = this.opts.id;
    }
  },

  createNote: function () {

    var tpl =  '<div class="note">'
              + '<div class="note-head"><span class="time"></span><span class="delete">×</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              +'</div>';

    var createTime = this.getTime();
    this.$note = $(tpl);
    this.$note.find('.note-head .time').html(createTime);
    this.$note.find('.note-ct').html(this.opts.context);
    this.opts.$ct.append(this.$note);

    if (!this.id){
      this.$note.css('top', '20px');  //新增放到右边
      this.setStyle(0);
      // this.setLayout();
    }
  },

  setStyle: function(opt) {

    var color = this.colors[opt];
    this.$note.find('.note-head').css('background-color', color[0]);
    this.$note.find('.note-ct').css('background-color', color[1]);
  },

  setLayout: function(){
    var self = this;
    if(self.clk){
      clearTimeout(self.clk);
    }
    self.clk = setTimeout(function(){
      Event.fire('waterfall');
    },100);
  },

  getTime: function(){
    var nowTime = new Date();
    // console.log(nowTime);
    var timeStr = '' + nowTime.getFullYear() + '-' + nowTime.getMonth() + '-' + nowTime.getDate()
                    + ' ' + nowTime.getHours() + ':';
    var m = nowTime.getMinutes() > 9 ? nowTime.getMinutes(): ('0' + nowTime.getMinutes());  
    timeStr += m + ':';        
    var s = nowTime.getSeconds() > 9 ? nowTime.getSeconds(): ('0' + nowTime.getSeconds());
    timeStr += s;
    return timeStr;
  },

  bindEvent: function () {
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');

    $delete.on('click', function(){
      self.delete();
    })

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {
      if($noteCt.html()=='input here') $noteCt.html('');
      $noteCt.data('before', $noteCt.html());
    }).on('blur paste', function() {
      if( $noteCt.data('before') != $noteCt.html() ) {
        $noteCt.data('before',$noteCt.html());
        self.setLayout();

        if(self.id){
          self.edit($noteCt.html());
        }else{
          self.setStyle(1);
          self.add($noteCt.html());
        }
      }
    });

    //设置笔记的移动
    $noteHead.on('mousedown', function(e){
      var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
          evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
    }).on('mouseup', function(){
       $note.removeClass('draggable').removeData('pos');
    });
    //鼠标在元素中的位置移动，这里指鼠标拖动note时的位置移动
    $('body').on('mousemove', function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX-$('.draggable').data('evtPos').x
      });
    });
  },

  edit: function (msg) {

    var self = this;
    $.post('/api/notes/edit',{
        id: this.id,
        note: msg
      }).done(function(ret){
      if(ret.status === 0){
        Tips('update success');
      }else{
        Tips(ret.errorMsg);
      }
    })
  },

  add: function (msg){

    var self = this;
    $.post('/api/notes/add', {note: msg})
      .done(function(ret){
        if(ret.status === 0){
          self.id = ret.id;
          Tips('add success');
        }else{
          self.$note.remove();
          Event.fire('waterfall')
          Tips(ret.errorMsg);
        }
      });
    //todo
  },

  delete: function(){
    var self = this;
    $.post('/api/notes/delete', {id: this.id})
      .done(function(ret){
        if(ret.status === 0){
          Tips('delete success');
          self.$note.remove();
          Event.fire('waterfall')
        }else{
          Tips(ret.errorMsg);
        }
    });

  }

};
window.note = Note;
module.exports.Note = Note;


