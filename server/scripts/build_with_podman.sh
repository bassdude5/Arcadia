#! /bin/bash

podman build ./ --no-cache --format docker -t arcadia:latest

#buildah  --contextdir ./client/ -t arcadia:latest