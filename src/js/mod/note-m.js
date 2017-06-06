var Tips = require('mod/tips.js').Toast;
var Note = require('mod/note.js').Note;
var Event = require('mod/event.js');


var NoteManager = (function(){

  function load() {
    $.get('/api/notes')
      .done(function(ret){
        if(ret.status == 0){
          $.each(ret.data, function(idx, ct) {
              new Note({
                id: ct.id,
                context: ct.text
              });
          });

          Event.fire('waterfall');
        }else{
          Tips(ret.errorMsg);
        }
      })
      .fail(function(){
        Tips('网络异常');
      });


  }

  function add(){
    new Note();
  }

  return {
    load: load,
    add: add
  }

})();

module.exports.NoteManager = NoteManager