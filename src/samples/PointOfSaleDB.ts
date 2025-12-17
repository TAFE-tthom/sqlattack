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

export const PointOfSaleDB: SampleDatabase = {

  getName(): string {
    return "PointOfSaleDB";
  },

  getSchema(): string {
    return SCHEMA;
  },

  getInsertData(): string {
    return "";
  },

  requirements(): SampleDatabaseRequirements {
    return {
      schema: true,
      data: false
    }
  }

  
}
