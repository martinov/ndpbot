var nodemailer = require('nodemailer'),
  nmmgt = require('nodemailer-mailgun-transport');

module.exports = function(controller) {

  controller.hears(['I am running late', 'I\'m running late', 'I\'m late for work'],
    'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
      if (!err) {
        convo.say('Oh man, I hope it\'s not too bad!');

        convo.ask('What is your ETA?', function(response, convo) {

          convo.ask('Your ETA is `' + response.text + '`?', [
            {
                pattern: 'yes',
                callback: function(response, convo) {
                    // since no further messages are queued after this,
                    // the conversation will end naturally with status == 'completed'
                    convo.next();
                }
            },
            {
                pattern: 'no',
                callback: function(response, convo) {
                    // stop the conversation. this will cause it to end with status == 'stopped'
                    convo.stop();
                }
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.repeat();
                    convo.next();
                }
            }
          ]);
          convo.next();

        }, {'key': 'eta'}); // store the results in a field called nickname

        convo.on('end', function(convo) {
          if (convo.status == 'completed') {
            bot.reply(message, 'OK, got it!');

            /*
            controller.storage.users.get(message.user, function(err, user) {
              if (!user) {
                user = {
                  id: message.user,
                };
              }
              user.eta = convo.extractResponse('eta');
              controller.storage.users.save(user, function(err, id) {
                bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
              });
            });
            */

            // create reusable transporter object
            var transporter = nodemailer.createTransport(
              nmmgt(config.mgAuth)
            );

            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: config.emailFrom, // sender address
              to: 'martin@ndp-studio.com', // comma-separated list of receivers
              subject: 'Someone is running late', // Subject line
              text: 'This dude wanted me to let you know that he\'ll be late..', // plaintext body
              html: '<b>Someone</b> is late for work. Their ETA is: <i>'
               + convo.extractResponse('eta') + '</i>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                bot.reply(message,
                  'I was not able to send an email to arrival@ but if someone asks me I\'ll let them know.');
              }
              //console.log('Message sent: ' + info.message);
              bot.reply(message,
                'I\'ve sent an email to arrival@ and if someone asks me I\'ll let them know.');
            });


          } else {
            // this happens if the conversation ended prematurely for some reason
            bot.reply(message, 'OK, nevermind!');
          }
        });
      }
    });

  });

  controller.hears(['When is (.*) coming in', 'When is (.*) arriving today'],
    'direct_message,direct_mention,mention', function(bot, message) {

      var name = message.match[1];

      bot.reply(message, 'Sorry, I don\'t have information on when ' + name + ' is arriving.');
  });

}
