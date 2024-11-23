FROM node:22-alpine

WORKDIR /part-task/Process

COPY package*.json ./

RUN yarn --verbose 

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
