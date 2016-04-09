module.exports = function(controller, config) {

  controller.hears(['make me (.*)'],
      'direct_message,direct_mention,mention', function(bot, message) {

        var thing = message.match[1];

        bot.reply(message,
          'Dude, I don\'t have a physical body (yet). Why don\'t you make ' + thing + ' yourself?');

  });

}
