# base on node version 18 we are creating this image
FROM node:18
# this workdirectory will be created in container named app 
WORKDIR /app
# copying package.json from our host current path to container /app 
#( . means /app, we can also write /app instead .)
COPY package.json .

#RUN npm install
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
         then npm install; \
         else npm install --only=production; \
         fi

#COPY source[host current path all file,folder] dest[/app, by ./ docker understand this is containers work directory]
COPY . ./

ENV port 3000
EXPOSE $port
#EXPOSE 3000

CMD ["node", "index.js"]
#CMD ["npm", "run", "dev"]
