FROM node:8

#for production
#RUN npm install -g nodemon
# If you are building your code for production
# RUN npm install --only=production

#for deployment
#RUN npm install -g pm2

EXPOSE 3000

#for production
#CMD [ "nodemon", "server.js" ]

#for deployent
#CMD [ "pm2", "start", "server.js" ]

# Create app directory
WORKDIR /var/www