#!/bin/bash

BRANCH=${1:-main} # 若未提供參數，預設為 main

git clean -fd
git fetch origin
git reset --hard origin/$BRANCH