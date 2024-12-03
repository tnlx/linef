FROM node:23-alpine AS installer
WORKDIR /src
COPY . .
RUN npm install

FROM installer AS devkit
EXPOSE 5173

FROM installer AS pkg
RUN npm run build

FROM scratch
COPY --from=pkg /src/build/ /
