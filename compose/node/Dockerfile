FROM node:8.2.1
#previous node:6.7

EXPOSE 8080

# TODO check if sass is needed?
# RUN apt-get update -qq && apt-get install -y build-essential ruby
# RUN gem install sass

RUN mkdir -p /app/micorr/stratigraphies/static/
RUN npm install -g grunt-cli@1.2.0 forever@0.15.3

WORKDIR /app
COPY package.json /app/
COPY ./micorr/stratigraphies/static/ /app/micorr/stratigraphies/static/

#COPY Gruntfile.js /src/Gruntfile.js
#missing js files

# install dependencies
# TODO compile ES2015 -> ES5 grunt babel, does not work!!!
# TODO in dev start a sepearate container with a wath task?
# start serveur
CMD npm install --production && forever micorr/stratigraphies/static/micorr/scripts/nodeServices/server.js
