

/**
 * Requirements that outline
 * if the schema and data is needed or just the schema
 */
export type SampleDatabaseRequirements = {
  schema: boolean,
  data: boolean,
}

/**
 * SampleDatabase
 * Object provides access to a schema
 * and its data
 * 
 */
export interface SampleDatabase {

  getName(): string;

  getSchema(): string;

  getInsertData(): string;

  requirements(): SampleDatabaseRequirements;
  
}
