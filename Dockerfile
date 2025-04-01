FROM postgres:15

RUN apt-get update && apt-get install -y git build-essential postgresql-server-dev-15

RUN git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git /tmp/pgvector
WORKDIR /tmp/pgvector
RUN make
RUN make install

COPY init_extensions.sql /docker-entrypoint-initdb.d/

RUN apt-get remove -y git build-essential postgresql-server-dev-15 && apt-get autoremove -y