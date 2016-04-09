FROM node:4.4.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --quiet
COPY . /usr/src/app
CMD [ "npm", "start" ]
