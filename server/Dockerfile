FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a as node

ENV NODE_ENV=development

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3333

CMD [ "node", "server.js" ]
