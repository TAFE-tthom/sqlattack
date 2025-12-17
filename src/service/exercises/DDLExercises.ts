import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';

import { DDLExercises as ExSet }
  from './ddl/Exported.ts'

import { PointOfSaleDB }
  from '../../samples/PointOfSaleDB.ts'
import { SqliteCommands } from '../../SQLiteProxy.ts';

export const Exercises: ExercisePack = {
  topic: 'DDL',
  description: 'Data Modelling Language',
  tasks: [
    NewTask()
      .name("Create Table - 1")
      .key('ddl_create_bool_01')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex1)
      .database('ddlbook01')
      .setup()
        .skip()
      .evaluation("DDL")
        .test('construction-1')
        .constructionEval()
        .insertStatement('Book', ['isbn_11', 'title', 'description'])
        .addValues(["'11111111111'", "'Learning SQL'", "'A book about learning sql'"])
        .addValues(["'11111111112'", "'Learning JS'", "'A book about learning js'"])
        .selectStatement('SELECT * FROM Book;')
        .expectedData(ExSet.ex1data)
    .done(),
    NewTask()
      .name("Primary & Foreign Keys - 2")
      .key('ddl_create_keys_02')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex2)
      .database('ddlbooks02')
      .setup()
        .skip()
      .evaluation("DDL")
        .test('construction-1')
        .constructionEval()
        .insertStatement('Author', ['author_id', 'first_name', 'last_name'])
        .addValues(['1', "'Jerry'", "'Jep'"])
        .addValues(['2', "'Gary'", "'Vern'"])
        .insertStatement('Book', ['isbn_11', 'title', 'description', 'author_id'])
        .addValues(["'11111111111'", "'Learning SQL'",
          "'A book about learning sql'", '2'])
        .addValues(["'11111111112'", "'Learning JS'",
          "'A book about learning js'", '1'])
        .selectStatement('SELECT * FROM Book;')
        .expectedData(ExSet.ex2data)
    .done(),
    NewTask()
      .name("Autoincrement - 3")
      .key('ddl-autoincr')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex3)
      .database('autoincr01')
      .setup()
      .skip()
      .evaluation("DML")
        .test('AutoIncrement-1')
        .constructionEval()
        .insertStatement('Ticket', ['ticket_origin', 'ticket_description',
          'resolved'])
        .addValues(["'jeff'",
          "'Problem with the computer'", 'false'])
        .addValues(["'jane'",
          "'Problem with ticketing service'", 'false'])
        .addValues(["'tom'",
          "'Problem with the tablet'", 'true'])
        .selectStatement('SELECT * FROM Ticket;')
        .expectedData(ExSet.ex3data)
    .done(),
    NewTask()
      .name("Drop Table - 4")
      .key('ddl-droptable')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex4)
      .database('pointofsale01')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
      .skip()
      .evaluation("DDL")
        .test('DropTable-1')
        .constructionEval()
        .selectStatement(`
            SELECT name FROM sqlite_schema
            WHERE type='table' AND
            name NOT LIKE 'sqlite_%';
          `)
        .expectedData(ExSet.ex4data)
    .done(),
    NewTask()
      .name("Alter Table - 5")
      .key('ddl-altertable01')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex5)
      .database('pointofsale02')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
      .skip()
      .evaluation("DDL")
        .test('AlterTable-1')
        .constructionEval()
        .selectStatement(`
            SELECT * FROM sqlite_schema
            WHERE type='table' AND
            name = 'Product';
          `)
        .expectedData(ExSet.ex5data)
    .done(),
  ],
  
}

