module.exports = function(controller, config) {

  controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

      bot.api.users.info({
          user: message.user
      }, function(err, res) {
          if (err) {
              bot.botkit.log('Failed to get user info for ' + message.user, err);
          } else {
              if (res.user.is_admin || res.user.name === 'martin') {
                  bot.startConversation(message, function(err, convo) {

                      convo.ask('Are you sure you want me to shutdown?', [
                          {
                              pattern: bot.utterances.yes,
                              callback: function(response, convo) {
                                  convo.say('Bye!');
                                  convo.next();
                                  setTimeout(function() {
                                      process.exit();
                                  }, 3000);
                              }
                          },
                      {
                          pattern: bot.utterances.no,
                          default: true,
                          callback: function(response, convo) {
                              convo.say('*Phew!*');
                              convo.next();
                          }
                      }
                      ]);
                  });
              } else {
                  bot.reply(message,
                      'Nice try but you\'re not on the list of people allowed to shut me down.');
              }
          }
      });
  });

}
