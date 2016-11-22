FROM node:6.9-alpine

# create app directory
RUN mkdir -p /app
WORKDIR /app

# install app dependencies
COPY package.json /app
RUN npm install --production

# copy all source code
COPY . /app

EXPOSE 3000
CMD ["npm", "start"]
