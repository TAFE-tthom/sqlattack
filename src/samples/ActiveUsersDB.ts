import { SampleDatabase,
  SampleDatabaseRequirements }
from './SampleDatabase';


const SCHEMA = `
CREATE TABLE User(user_id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(40) NOT NULL, email VARCHAR(80) NOT NULL, active BOOLEAN NOT NULL);

`;

const DATA = `

INSERT INTO User(username, email, active) VALUES
  ('jeff01', 'jeff@jeff.co', true),
  ('alice_ice', 'alice@icetower.xyz', true),
  ('bobx', 'xxbobxx@games.gg', false);
`

export const ActiveUsersDB: SampleDatabase = {

  getName(): string {
    return "ActiveUserDB";
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

