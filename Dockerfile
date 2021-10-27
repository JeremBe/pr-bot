FROM node:14-buster-slim

# Create app directory
WORKDIR /usr/src/app

RUN \
  apt-get update -qq \
  && apt-get install -y --no-install-recommends \
  curl \
  apt-transport-https \
  ca-certificates \
  postgresql-client \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json yarn.lock ./

RUN yarn --frozen-lockfile
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]
