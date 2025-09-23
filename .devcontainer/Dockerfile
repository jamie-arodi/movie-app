FROM node:20

# Install additional OS packages if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    vim \
    nano \
    && apt-get autoremove -y && apt-get clean -y

# Install global npm packages for development
RUN npm install -g \
    @vscode/vsce \
    vercel \
    npm-check-updates

# Create a non-root user
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# Set up shell aliases and environment for root user
RUN echo 'alias ll="ls -alF"' >> /root/.bashrc \
    && echo 'alias la="ls -A"' >> /root/.bashrc \
    && echo 'alias l="ls -CF"' >> /root/.bashrc \
    && echo 'alias dev="npm run dev"' >> /root/.bashrc \
    && echo 'alias test="npm run test"' >> /root/.bashrc \
    && echo 'alias build="npm run build"' >> /root/.bashrc

# Set working directory
WORKDIR /workspaces/movie-app

# Pre-create package.json if it doesn't exist (this helps with caching)
# Note: This will be overwritten when the real workspace is mounted
RUN echo '{"name": "temp", "version": "1.0.0"}' > package.json

# Configure npm for better performance
RUN npm config set fund false \
    && npm config set audit false

# Create node_modules directory with proper permissions
RUN mkdir -p node_modules && chown -R root:root node_modules