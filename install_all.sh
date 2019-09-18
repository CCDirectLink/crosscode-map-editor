#!/bin/bash

cd common
npm install
npm run build
cd ../backend
npm install
cd ../webapp
npm install