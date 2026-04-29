#!/bin/bash
cd /Users/apple/Desktop/hessa-lls-main/frontend-website && npm run dev -- -p 3000 &
cd /Users/apple/Desktop/hessa-lls-main/webapp && npm run dev -- -p 3002 &
wait
