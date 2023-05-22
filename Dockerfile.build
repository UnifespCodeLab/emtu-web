# pull official base image
FROM node:16.16.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN yarn global add eslint
RUN yarn global add react-scripts@4.0.3
RUN yarn global add nuxt

# add app
COPY . .

EXPOSE 3000

# start app
CMD ["yarn", "start"]