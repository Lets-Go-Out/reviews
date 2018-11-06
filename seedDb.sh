#!/usr/bin/env bash

read -p 'your mySql username: ' username
read -sp 'mySql password:' password
node fakeDataGenerator.js
mysql -u $username --local-infile --password=$password < seedscript.sql
rm *.csv