
/*
 * GET home page.
 */

module.exports = {
  index : function(req, res) {
    res.render('index');
  },

  board : function(req, res) {
    res.render('board');
  },
};