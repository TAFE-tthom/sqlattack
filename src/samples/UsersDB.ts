import { SampleDatabase,
  SampleDatabaseRequirements }
from './SampleDatabase';


const SCHEMA = `
CREATE TABLE User(user_id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(40) NOT NULL, email VARCHAR(80) NOT NULL);

`;

const DATA = `

INSERT INTO User(username, email) VALUES
  ('jeff01', 'jeff@jeff.co'),
  ('alice_ice', 'alice@icetower.xyz'),
  ('bobx', 'xxbobxx@games.gg');
`

export const UsersDB: SampleDatabase = {

  getName(): string {
    return "UserDB";
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
