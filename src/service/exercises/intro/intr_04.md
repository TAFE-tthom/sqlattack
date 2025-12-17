
## DataTypes - Text

As with most programming languages we have a way we categorise data. SQL is no different in this case, depending on what data you want to record, you want to select and use most suitable datatype to represent this.

Each datatype has suitable operators associated with it. We will look at the TEXT datatypes now.

### Text

For text data, this is usually expressed between single quotes like so:

```sql
'This is text'
```

And the following data types are appropriate:

* `CHAR(size)` - Fixed number of characters

* `VARCHAR(size)` - Up to the number of characters.

* `TEXT` - Arbitrary size

### Operators

* `||` - For concatenation.

Within `sqlite`, the operator used for concatenation is `||`, however and what you will learn is that operators are not **universal** with sql.

Within `sqlite`, there is typically a preference to use `functions` over `operators`

### Exercise

Use `||` to concatenate the words:

* `Mr`
* `Jeff`
* `Davidson`

The resulting output should be:

`Mr Jeff Davidson`

You will need to ensure you have spaces between each word.

---

Introduction set of exercises expose some basic functions and constructions with SQL.
