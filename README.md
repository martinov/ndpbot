# ndpbot
A Slackbot for NDP used to manage things like scheduling of resources and other cool stuff. Based on [Botkit](http://howdy.ai/botkit).

## You need a token
Go to [Slack](http://my.slack.com/services/new/bot) and create one.

## Docker step-by-step
    # git clone git+ssh://git@github.com/martinov/ndpbot.git
    # cp sample.env .env && vi .env
    # docker build -t mmartinov/ndpbot .
    # docker run --name redis-ndpbot -d -v ~/docker/redis-data:/data redis redis-server --appendonly yes
    # docker run --name ndpbot1 --link redis-ndpbot:redis -d mmartinov/ndpbot
    # docker exec -it ndpbot1 bash
    # docker ps -> docker logs

## Random resources
- [.env](https://www.npmjs.com/package/dotenv)
- [How to deploy Slack Bots to Heroku](https://blog.heroku.com/archives/2016/3/9/how-to-deploy-your-slack-bots-to-heroku)
- [Botie](http://blog.templeton.host/self-training-nlp-enabled-slack-bot-tutorial/)
- [Chipsandguac](https://github.com/jquatier/chipsandguac/blob/master/chipsandguac.js)
