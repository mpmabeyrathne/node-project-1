FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm@11.24.0 --allow-scripts=pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]