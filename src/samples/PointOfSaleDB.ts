import { SampleDatabase,
  SampleDatabaseRequirements }
from './SampleDatabase';


const SCHEMA = `
CREATE TABLE Product(product_id INTEGER PRIMARY KEY, name VARCHAR(40) NOT NULL, price DECIMAL NOT NULL);

CREATE TABLE LineItem(saleid INT PRIMARY KEY, productID INT NOT NULL, qty INT NOT NULL);

CREATE TABLE Sale(id INT PRIMARY KEY, saledate INT NOT NULL);

CREATE TABLE InvoiceLogs(id INTEGER PRIMARY KEY, desc TEXT);

CREATE TABLE PaymentProcessors(id INT PRIMARY KEY, name TEXT);
`;

const DATA = `
INSERT INTO Product(product_id, name, price) VALUES
  (2, 'A piece of string', 0.5),
  (3, 'Cola - With Sugar', 5.5),
  (5, 'Jelly Beans (Not Edible)', 2.25),
  (10, 'Blank CD', 12.55),
  (12, 'Blank DVD', 7.5),
  (89, '8GB DDR Ram (3200mhz)', 760.5);
`;

export const PointOfSaleDB: SampleDatabase = {

  getName(): string {
    return "PointOfSaleDB";
  },

  getSchema(): string {
    return SCHEMA;
  },

  getInsertData(): string {
    return DATA;
  },

  requirements(): SampleDatabaseRequirements {
    return {
      schema: true,
      data: true
    }
  }

  
}
