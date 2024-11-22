FROM alpine

WORKDIR /part-task/Agent

COPY package*.json ./

RUN yarn --verbose

COPY * .

EXPOSE 3002

CMD ["npm", "start"]
