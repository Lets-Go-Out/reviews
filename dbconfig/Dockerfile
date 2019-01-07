FROM mysql:latest

ENV MYSQL_ALLOW_EMPTY_PASSWORD="yes"

COPY . /docker-entrypoint-initdb.d

EXPOSE 3306

CMD ["--default-authentication-plugin=mysql_native_password"]