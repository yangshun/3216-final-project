
/*
 * GET home page.
 */

module.exports = {
  index : function(req, res) {
    res.render('index');
  },

  results : function(req, res) {
    res.render('results');
  },
};