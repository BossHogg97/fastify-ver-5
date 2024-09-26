FROM node:21.7.3-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add tsx -g

# Throw-away build stage to reduce size of final image
FROM base AS builder
RUN echo 'STAGE BUILDER'

WORKDIR /temp-apps

# Install node modules
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --ignore-scripts --frozen-lockfile

# Remove development dependencies
RUN pnpm prune --prod
RUN echo 'DEV DEPENDENCIES REMOVED'

# Copy application code and node modules
COPY . ./

# Build application
RUN pnpm build \
  && echo 'BUILD SUCCEEDED'

# Final stage for app image
FROM base as deploy

# Node.js app lives here
WORKDIR /app

# Copy built application
COPY --from=builder   /temp-apps/dist/              dist
COPY --from=builder   /temp-apps/boot.sh            .
COPY --from=builder   /temp-apps/node_modules/      node_modules

# Set environment variables for configuration and defaults
ENV NODE_ENV=production
ENV PORT=5015

# Expose the port on which the application will run
EXPOSE $PORT

USER node

CMD ["/bin/sh", "/app/boot.sh"]

# Allows developers to exec bash command to debug container internals
# ENTRYPOINT ["tail", "-f", "/dev/null"]