const nodemailer = require('nodemailer'),
  nodemailerMailGunTransport = require('nodemailer-mailgun-transport')
  Promise = require('bluebird');

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

            controller.storage.users.get(message.user, function(err, user) {
              if (!user) {
                user = {
                  id: message.user,
                };
              }
              user.eta = convo.extractResponse('eta');
              if (user.real_name == undefined || user.email == undefined) {
                // Get user info from Slack API
                apiGetUserInfo(bot, message.user).then(function (apiUser) {
                  //console.log(apiUser.profile.email, 'api result');
                  user.real_name = apiUser.profile.real_name;
                  user.email = apiUser.profile.email;
                  controller.storage.users.save(user, function(err, id) {
                    if (err) {
                      bot.botkit.log('Failed to store user info', error);
                    }
                  });
                });
              }

              // create reusable transporter object
              const transporter = nodemailer.createTransport(
                nodemailerMailGunTransport({
                  'auth': {
                    'api_key': process.env.MG_API_KEY,
                    'domain': process.env.MG_DOMAIN
              }}));

              // setup e-mail data with unicode symbols
              var mailOptions = {
                from: process.env.EMAIL_FROM, // sender address
                to: process.env.EMAIL_ARRIVAL + ', ' + user.email, // comma-separated list of receivers
                subject: user.real_name + ' is running late', // Subject line
                text: user.real_name + ' is late for work. Their ETA: ' + user.eta, // plaintext body
                html: '<b>' + user.real_name + '</b> is late for work. Their ETA: '
                  + '<i>' + user.eta + '</i>' // html body
              };

              // send mail with defined transport object
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  bot.reply(message,
                    'I was not able to send an email to arrival@ but if someone asks me I\'ll let them know.');
                  bot.botkit.log('Failed to send an email', error);
                  return;
                }
                //console.log('Message sent: ' + info.message);
                bot.reply(message,
                  'I\'ve sent an email to arrival@ and if someone asks me I\'ll let them know.');
              });

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

// Get User Info API request
const apiGetUserInfo = function (bot, userId) {
  return new Promise(function (resolve, reject) {
    // Get user info from Slack API
    bot.api.users.info({
      user: userId,
    }, function(err, res) {
      if (err) {
        bot.botkit.log('Failed to get user info for ' + userId, err);
        reject(err);
      } else {
        resolve(res.user);
      }
    });
  });
};
