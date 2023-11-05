#!/bin/bash

# build and run the react project
cd www

yarn build

cd ..

go run . -c ./config.toml -s PASSWORD -u USERNAME

