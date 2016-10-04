FROM node:6.7
EXPOSE 8888

RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby
RUN gem install sass

#RUN mkdir /src

RUN npm install grunt-cli -g

WORKDIR /app
#COPY package.json /src/package.json
RUN npm install

#COPY Gruntfile.js /src/Gruntfile.js

EXPOSE 3000
EXPOSE 35729

CMD ["npm", "start"]
