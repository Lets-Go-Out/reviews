FROM mysql:latest

COPY . /docker-entrypoint-initdb.d

ENV MYSQL_ROOT_PASSWORD=abc123

EXPOSE 3306

CMD ["--default-authentication-plugin=mysql_native_password"]