FROM node:12.16.2-stretch-slim

EXPOSE 8080

# we must use at least inkscape 0.91 for svg export (default stretch version is now ok)
RUN apt-get update && apt-get install -y inkscape
RUN mkdir -p /app/dist
RUN npm install -g forever@1.0.0

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install --production

# temp copy of es6 source during image buils
COPY ./micorr/stratigraphies/static/ /app/micorr/stratigraphies/static/
COPY ./micorr/stratigraphies/ngapp/src /app/micorr/stratigraphies/ngapp/src

# tranpile es6 sources from micorr/stratigraphies/ngapp/src/
RUN npm run build
# we can now remove the sources from the image
RUN rm -rf /app/micorr/stratigraphies/static/

# start server from container
CMD forever /app/dist/nodeServices/server.js
