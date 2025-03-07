FROM node:23-alpine AS installer
WORKDIR /src
# Installing dependencies in earlier layers of the Dockerfile,
# to take advantage of docker cache and speed up the build
COPY package.json .
# Cache also the node dependencies
RUN --mount=type=cache,target=/root/.npm npm install
COPY . .

FROM installer AS devkit
EXPOSE 5173

FROM installer AS pkg
RUN npm run build

FROM scratch
COPY --from=pkg /src/build/ /
