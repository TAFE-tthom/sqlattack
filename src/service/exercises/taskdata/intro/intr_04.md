
## Column Names and Alias

We will introduce a new keyword that is useful for more complex queries but also naming your columns. We may want to appropriately name the column we are retrieving. We can use the `AS` keyword after specifying the column name to give it **another name**.

While this exercise will be a trivial example, you may encounter a task where it may want you to print the **Fullname** of a customer.


```sql
SELECT 'Hello' as Greeting;
```

It will show `Greeting` as the column name and 'Hello' one of the entries below.

A real world example would look like this.

```sql
SELECT CONCAT(first_name, ' ',
  last_name) AS Fullname
  FROM Customer;
```

This will output `fist_name` and `last_name`, separated by a space under a single column called `Fullname`.
