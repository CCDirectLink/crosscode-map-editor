#!/bin/bash

cd common
npm ci
npm run build
cd ../backend
npm ci
cd ../webapp
npm ci
