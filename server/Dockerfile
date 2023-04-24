# Roughly taken from here:
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp

FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

# Should be:
# RUN npm ci --only=production

COPY . .

EXPOSE 3001

RUN chown -R node:node /usr/src/app/* 
USER node   

CMD ["node", "server.js"]