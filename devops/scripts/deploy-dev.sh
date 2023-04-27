#!/bin/bash

# This script is used to deploy the frontend to a personal dev server 
# using SSH-forwarding.

# Running:
# 1.
# Define these variables in your .env file in the root of this repo:
#  DEV_SERVER_IP=''
#  DEV_SERVER_USER=''
#  DEV_SERVER_KEY='/home/username/.ssh/privatekey.pem'
#  DEV_SERVER_DEPLOY_DIR='/home/username/liligptfront'
#  APP_PUBLIC_URL='http://remoteip:28090/'
#  REACT_APP_KEYCLOAK_URL='https://mykeycloak:8081/auth'
#  REACT_APP_KEYCLOAK_REALM=''
#  REACT_APP_KEYCLOAK_CLIENT_ID='account'
# 
# 2.
# then run:
# bash devops/scripts/deploy-dev.sh

function main() {
  local HERE=$(cd $(dirname "$0") && pwd)
  local ROOT=$(cd "$HERE/../.." && pwd)

  # load env
  set -a
  source "$ROOT/.env"
  set +a

  echo "DEV_SERVER_IP=$DEV_SERVER_IP"
  echo "DEV_SERVER_USER=$DEV_SERVER_USER"
  echo "DEV_SERVER_KEY=$DEV_SERVER_KEY"
  echo "DEV_SERVER_DEPLOY_DIR=$DEV_SERVER_DEPLOY_DIR"
  echo "REACT_APP_PUBLIC_URL=$REACT_APP_PUBLIC_URL"
  echo ""

  # build
  build_app "$ROOT" "$ROOT/dist" || \
    die "Failed to build the app"
  # rm dest folder
  run_ssh_command \
    "rm -rf $DEV_SERVER_DEPLOY_DIR" 2>/dev/null
  # create dest folder
  run_ssh_command \
    "mkdir -p $DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to create dest folder $DEV_SERVER_DEPLOY_DIR"
  # copy dist folder to $DEV_SERVER_DEPLOY_DIR
  copy_folder \
    "$ROOT/dist" "$DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to copy dist folder to $DEV_SERVER_DEPLOY_DIR"
  # install dependencies
  run_ssh_command \
    "cd '$DEV_SERVER_DEPLOY_DIR/dist' && yarn --production" || \
    die "Failed to install dependencies"
  # copy docker-compose.yml artifact file
  copy_file \
    "$ROOT/devops/artifacts/docker-compose.yml" "$DEV_SERVER_DEPLOY_DIR" || \
    die "Failed to copy docker-compose.yml file"
  # restart the container
  run_ssh_command \
    "cd '$DEV_SERVER_DEPLOY_DIR' && docker compose up -d --force-recreate" || \
    die "Failed to restart the container"
  echo ""
  # echo "Open: http://$DEV_SERVER_IP:28090"
  echo "Open: $REACT_APP_PUBLIC_URL"
  echo ""
  echo "Done!"
}

function build_app() {
  local ROOT="$1"
  local DIST="$2"

  echo "Removing old dist"
  rm -rf "$DIST" 2>/dev/null

  echo "Building the app"
  cd "$ROOT"
  yarn build || return 1

  echo "Copy build to $DIST"
  mkdir -p "$DIST"
  cp -r "$ROOT/public" "$DIST/public"
  cp "$ROOT/.env" "$DIST/.env"
  cp -r "$ROOT/.next" "$DIST/.next"
  cp "$ROOT/next.config.js" "$DIST/next.config.js"
  cp "$ROOT/package.json" "$DIST/package.json"
  cp "$ROOT/yarn.lock" "$DIST/yarn.lock"
  echo "Finished building the app"
  echo ""
}

function copy_folder() {
  local SRC="$1"
  local DEST="$2"

  echo "Copying $SRC to $DEST"
  scp -i "$DEV_SERVER_KEY" -r "$SRC" "$DEV_SERVER_USER@$DEV_SERVER_IP:$DEST"
  echo ""
}

function copy_file() {
  local SRC="$1"
  local DEST="$2"

  echo "Copying $SRC to $DEST"
  scp -i "$DEV_SERVER_KEY" "$SRC" "$DEV_SERVER_USER@$DEV_SERVER_IP:$DEST"
  echo ""
}

function run_ssh_command() {
  local COMMAND="$1"
  local FULLCOMMAND="ssh -i \"$DEV_SERVER_KEY\" -t \"$DEV_SERVER_USER@$DEV_SERVER_IP\" \"bash -i -c \\\"$COMMAND\\\"\""

  echo "Running command:"
  echo "$FULLCOMMAND"
  echo ""
  eval "$FULLCOMMAND"
}

function die() {
  echo ""
  echo "Error: $1"
  exit 1
}

main
