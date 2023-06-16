ARG VARIANT
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

ARG TZ
ENV TZ="$TZ"

ARG PNPM_VERSION

ENV DEV_HOME_DIR=/home/node
ENV NODE_ENV=development

ENV PNPM_HOME="${DEV_HOME_DIR}/.local/share/pnpm"
ENV PATH="$PATH:$PNPM_HOME"

SHELL ["/bin/bash", "-c"]
ENV SHELL="bash"

RUN mkdir -p ${DEV_HOME_DIR}/.vscode-server/extensions \
  && chown -R node ${DEV_HOME_DIR}/.vscode-server \
  && mkdir -p ${DEV_HOME_DIR}/.local/share/pnpm/store \
  && chown -R node:node ${DEV_HOME_DIR}/.local/share/pnpm

USER node

RUN npm install -g pnpm@${PNPM_VERSION}

RUN pnpm config set store-dir "${DEV_HOME_DIR}/.local/share/pnpm/store" \
  && pnpm add -g @nestjs/cli @antfu/ni npm-check-updates

USER root

RUN pnpx playwright install-deps

EXPOSE 3000
EXPOSE 5000
