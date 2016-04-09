var nodemailer = require('nodemailer'),
    nmmgt = require('nodemailer-mailgun-transport');

module.exports = function(controller, config) {

  controller.hears(['I am unscheduled', 'I need tasks'],
      'direct_message,direct_mention,mention', function(bot, message) {

          bot.reply(message, 'OK dude, I will email schedule@ and mark the board for you.');

  });

}
