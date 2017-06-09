FROM node:6.7

EXPOSE 8080

# TODO check if sass is needed?
# RUN apt-get update -qq && apt-get install -y build-essential ruby
# RUN gem install sass

RUN mkdir /app
RUN npm install -g grunt-cli forever

WORKDIR /app

# For prod install and copy necessary files into image?
#COPY package.json /app/package.json
#RUN npm install
#COPY Gruntfile.js /src/Gruntfile.js
#missing js files

# install dependencies
# TODO compile ES2015 -> ES5 grunt babel, does not work!!!
# TODO in dev start a sepearate container with a wath task?
# start serveur
CMD npm install && forever micorr/stratigraphies/static/micorr/scripts/nodeServices/server.js
