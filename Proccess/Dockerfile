FROM alpine

WORKDIR /part-task/Proccess

COPY package*.json ./

RUN yarn --verbose 

COPY * .

EXPOSE 3002

CMD ["npm", "start"]
