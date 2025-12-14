## Inventory management

You will design a database that is designed for
inventory management of different warehouses.

Before you create your tables, create a database called:

* InventoryDB

Your database must design the following tables:

* Items
* Warehouses

For each entry in the Items table, an entry will have
the following fields.

* `item_id` - Integer, Primary Key
* `item_name` - Varchar(64)
* `item_description` - Varchar(255)
* `location_id` - Integer

The `location_id` will reference a the primary key of
the `Warehouses` table. This will be where the item is
located.

An entry in the Warehouses table will have the following
fields.

* `warehouse_id` - Integer, Primary Key
* `warehouse_location` - Varchar(64)
* `warehouse_description` - Varchar(255)

