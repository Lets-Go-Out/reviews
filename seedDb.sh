#!/usr/bin/env bash

node fakeDataGenerator.js
mysql -u root --local-infile  < seedscript.sql
rm *.csv