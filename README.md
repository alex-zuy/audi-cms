A toy project which implements official site of imaginary Audi motor show,
built using the most powerful technologies available nowadays.

# Running application

1. Prerequisites:
    * Installed software:
        * Java 8 JDK (OpenJDK or Oracle)
        * Typesafe Activator
        * PostgreSQL server v9.3 or newer
        * Ruby and RubyGem
        * Recent version of Node.js and npm (0.12.7 is known to work)
        * Git
    * Other:
        * Some patience
2. Configuring environment:
    > This manual assumes that all required tools are available on PATH

    * Create database in PostgreSQL:

    ```
    $ sudo -u postgres psql -c "CREATE DATABASE \"audi-cms\""
    ```

    * Install sass gem:

    ```
    $ sudo gem install sass
    ```

3. Get project sources:

    ```
    $ git clone git@github.com:pirat9600q/audi-cms.git audi-cms
    ```

    and then

    ```
    cd audi-cms
    ```

4. Entering sbt shell:

    By default application will try to access database `audi-cms` using
    user `postgres` and empty password. If necessary, each of this parameters can be overridden
    using system properties, passed through arguments to `activator`. For example this invocation
    resembles default config:

    ```
    $ activator -Dslick.dbs.default.db.properties.databaseName="audi-cms" -Dslick.dbs.default.db.properties.user="postgres" -Dslick.dbs.default.db.properties.password=""
    ```

    If you dont need to override any properties just run:

    `$ activator`

5. Starting application:

    Run `run` command in sbt shell. After server is started you will see line like this:

    `[info] p.c.s.NettyServer - Listening for HTTP on /0:0:0:0:0:0:0:0:9000`

    Now you can go to application`s [main page](http://localhost:9000).

6. Adding managers:

    So far, so good. Currently you can view user-space pages of web application, but can not enter control panel
    because there is no users in DB. To add admin follow this steps:

    Enter postgresql shell:

    ```
    $ sudo -u postgres psql -d "audi-cms"
    ```

    Insert manager record:

    ```
    audi-cms=# INSERT INTO public.managers (id, full_name, email, password_hash, is_admin) VALUES (91, 'AdminF AdminS AdminP', 'admin@example.net', '$2a$10$EGbkF6/LOPjOtHb50P7BY.N.wfpxjy4qWR0dqTjvGe2XerhfspjGO', true);
    ```

    Exit shell:

    ```
    \q
    ```

    Congratulations! Now you can login using email 'admin@example.net' and password 'admin'.
