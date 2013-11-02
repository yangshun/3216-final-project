
/*
 * GET home page.
 */

module.exports = {
  index: function(req, res) {
    res.render('index', { title: 'Prototype-1' });
  },

  choose: function(req, res) {
    var room = req.body.room;
    var type = req.body.type;
    console.log('type: '+type);
    console.log('room: '+room);
    res.redirect('/'+type+'/'+room);
  },

  screen: function(req, res) {
    // res.render('screen', { title: 'Prototype-1 Screen' });
    res.render('screen', { title: 'Nutty Ninjas Arena' });
  },

  landing: function(req, res) {
    res.render('landing', { title: 'Nutty Ninjas' });
  },

  screenWithRoom: function(req, res) {
    res.render('screen', { title: 'Nutty Ninjas Arena' });
  },

  controller: function(req, res) {
    res.render('controller', { title: 'Nutty Ninjas' });
  },

  controllerWithRoom: function(req, res) {
    res.render('controller', { title: 'Nutty Ninjas' });
  },
  
  botcontrollerWithRoom: function(req, res) {
    res.render('bot_controller', { title: 'Nutty Ninjas' });
  }
};
