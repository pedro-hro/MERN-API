FROM node:latest

# Create app directory
WORKDIR /api

# Install app dependencies
COPY . .

RUN rm -rf node_modules
RUN yarn install

CMD ["yarn", "start"]

EXPOSE 3000