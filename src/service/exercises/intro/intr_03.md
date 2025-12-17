## Querying a database

Now here comes the fun! You have been given a sample database that you can query. This database contains a few columns which we can refer to in our `SELECT` statement.

You will need to query the following table and use the `FROM` keyword.

The way that this is structured is:

```
SELECT column_1, column_2, ... FROM table_1, ...
```

The above snippet is mostly outlining the format that is expected by SQL. You can omit the columns and retrieve **ALL** columns using the `*` symbol.

The `FROM` keyword allows us to refer to a table or another collection.

You will need to query the table `User` and retrieve the `username` and `email` of each one.

Construct an SQL query to perform this.

---

Reference:

* [SQLite Select](https://sqlite.org/lang_select.html)

---

Please wait for the database to load, if the `Database Loading` notification does not disappear. Make sure your browser supports `web workers` and `wasm`.
