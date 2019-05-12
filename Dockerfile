FROM node:8
WORKDIR  test-for-job-1/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]