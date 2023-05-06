# FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a as node

# ENV NODE_ENV=dev

# WORKDIR /usr/src/api

# COPY package*.json ./
# COPY package-lock.json ./

# ENV PATH /usr/src/api/node_modules/.bin:$PATH

# USER root

# RUN npm i -g @adonisjs/cli
# RUN npm install

# COPY --chown=node:node . .

# EXPOSE 3333

FROM node:10.13

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
COPY package.json $HOME/
RUN chown -R app:app $HOME/*

USER root
WORKDIR $HOME
RUN npm i -g @adonisjs/cli
RUN npm install
