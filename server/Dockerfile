# GET THE IMAGE OF NODE v16 
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# COPY file of dependencies and INSTALL 
# A wildcard (*) is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "index.js" ]
## start the server -> node index.js

# docker login -u stardusteightt (with DockerHub account)
# In this directory -> docker build . -t stardusteightt/mirage-chat-server (<usernameInDockerHub>/<ImageRepository>)
# docker images
# docker run -d -p 8080:5000 stardusteightt/mirage-chat-server:latest
# or docker run -p 5000:5000 stardusteightt/mirage-chat-server:latest (if EXPOSE = 5000)
# http://localhost:5000/api/auth/allUsers/6340ba7c11f8c41c57a5f4b8

# docker ps (list processes)
# docker kill <container id> (shut down the image)
# docker stop $(docker container ls -q) (stop all processes)

## Deploy
# docker push stardusteightt/mirage-chat-server:1.3

