FROM node:22-alpine

WORKDIR /part-task/Agent

COPY package*.json ./

RUN yarn --production=false

COPY * .

EXPOSE 3002

CMD ["yarn", "start"]
