# Build the React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the app with Nginx
FROM nginx:alpine
# Delete the default config that comes with Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copy your config specifically to the conf.d folder
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Ensure your web files are in the right spot
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]