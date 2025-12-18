
## Filtering using `WHERE`

A very common keyword is using the `WHERE` keyword that allows you to filter data. This is critical to most sql usage as we are usually wanting to retrieve records that contain certain properties.

To use the `WHERE` clause, we will also need to introduce common operators that are used for comparison.

The format of the query takes on the following:

```sql
SELECT columns,... FROM tables,...
  WHERE column OPERATOR value
```

`OPERATOR` and `value` are placeholder words in this case and are not part of the 

* `OPERATOR` can mean the following:
  * `=` and `==` - Checking to see if it matches the value on the right handside

  ```
    WHERE amount == 5;
  ```
  or

  ```
    WHERE name = 'John';
  ```

  Commonly `=` is used, `==` does appear in most sql vendors but double check the manual.

  * `!=` - Used to check if the row value **does not** equal the value being checked.

  ```
    WHERE amount != 10;
  ```

  * `>`, `<`, `<=`, `>=` - These are used to check
  if a numeric or date column (or value) on the right handside.

  ```
    WHERE date_paid
      >= '2020-12-01 00:00:00';
  ```
  
It is possible to have multiple conditions within a query using `OR` and `AND`.

```
WHERE amount = 5 OR amount = 10;
```

The above snippet will have a clause that checks if the amount if 5 OR 10.

With `AND`, we need both conditions to be true.

```
WHERE name = 'John' AND id = 10;
```

It will check if the `name` is `John` and that their `id` is 10.

---

### Exercise

In the following exercise, retrieve all users who are currently `active`.

The table you have been has the following schema.

* `User`
  * `username`, `VARCHAR`
  * `email`, `VARCHAR`
  * `active`, `BOOLEAN`

It should return only 2 entries, make sure you only output their `username` and `email`.
