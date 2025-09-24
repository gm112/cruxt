FROM mcr.microsoft.com/devcontainers/javascript-node:22-trixie

RUN npm install npm@latest -g --force \
    npm install -g corepack@latest \
    && corepack enable

CMD [ "sleep", "infinity" ]
