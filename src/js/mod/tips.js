//设计模式中的混合模式（也可以用设计模式中的模块模式，适合与发布订阅模式结合使用）
require('less/tips.less');

function tips(msg, time){
  this.msg = msg;
  this.dismissTime = time||1000;  //ms
  this.createTips();
  this.showTips();
}
tips.prototype = {
  createTips: function(){
    var tpl = '<div class="tips">'+this.msg+'</div>';
    this.$tips = $(tpl);
    $('body').append(this.$tips);
  },
  showTips: function(){
    var self = this;
    this.$tips.fadeIn(300, function(){
      setTimeout(function(){
         self.$tips.fadeOut(300,function(){
           self.$tips.remove();
         });
      }, self.dismissTime);
    });

  }
};

function Tips(msg,time){
  return new tips(msg, time);
}

module.exports.Tips = Tips;