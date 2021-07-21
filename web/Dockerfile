FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a as node

WORKDIR /usr/src/app
 
COPY package*.json ./

RUN npm install

# ENV NODE_ENV production
# ci --only=production
 
COPY . .
 
EXPOSE 3000

USER node
 
CMD [ "npm", "start" ]