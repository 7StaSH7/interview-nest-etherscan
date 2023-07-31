FROM node:18-alpine
 
WORKDIR /user/src/app
 
COPY . .
 
RUN yarn install
RUN yarn build
 
USER node
 
CMD yarn migration:run && \
    yarn start:prod