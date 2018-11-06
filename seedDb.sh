#!/usr/bin/env bash

node fakeDataGenerator.js
mysql -u root --local-infile -p < seedscript.sql
rm *.csv