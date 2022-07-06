FROM node:alpine AS builder
WORKDIR /code
ADD package.json /code
ADD yarn.lock /code
RUN yarn
ADD . /code
RUN yarn build

FROM node:alpine
ENV REGISTRY=http://verdaccio.local/
ENV ACCESS=public
ENV TOKEN=token
WORKDIR /code
COPY --from=builder code/dist .
COPY --from=builder code/package.json .
COPY --from=builder code/tsconfig.json .
COPY --from=builder code/README.md .
ADD .npmrc /root/
ENTRYPOINT ["yarn", "publish", "--access=public"]
# ENTRYPOINT npm set registry=$REGISTRY //$REGISTRY/:_authToken=$TOKEN && npm publish --access=$ACCESS
# ENTRYPOINT ["npm", "set", "registry=$REGISTRY", "//$REGISTRY/:_authToken=$TOKEN", "&&", "npm", "publish", "--access=$ACCESS"]
