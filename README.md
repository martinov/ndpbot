# ndpbot
A Slackbot for NDP used to manage things like scheduling of resources and other cool stuff. Based on [Botkit](http://howdy.ai/botkit).

## You need a token
Go to [Slack](http://my.slack.com/services/new/bot) and create a new token.

## Start the bot
    $ token=<token> nodemon bot.js

## Docker step-by-step
    # git clone git+ssh://git@github.com/martinov/ndpbot.git
    # cp config.sample.js config.js && vi config.js
    # docker build -t mmartinov/ndpbot .
    # docker run -d --name ndpbot1 mmartinov/ndpbot
    # docker ps -> docker logs
