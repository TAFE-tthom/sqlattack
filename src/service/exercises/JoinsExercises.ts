import { ExercisePack } from './Defaults';
import { NewTask } from './taskutil/EvalMaker';
import { JoinsExercises as ExSet } from './taskdata/joins/Exported.ts'
import { SqliteCommands } from '../../sql/SQLiteProxy.ts';
import { SakilaDatabase } from '../../samples/Sakila.ts';

export const Exercises: ExercisePack = {
  topic: 'Joins',
  description: 'Joins Challenges',
  tasks: [
    NewTask()
      .name("Actors & Films - 1")
      .key('dmlactors1')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex1)
      .database('sakila01')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('Join-1')
        .orderedEntries()
        .expectedData(ExSet.ex1data)
    .done(),
    NewTask()
      .name("Customer Rentals - 2")
      .key('customers02')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex2)
      .database('sakila01')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('Join-1')
        .orderedEntries()
        .expectedData(ExSet.ex2data)
    .done(),
    NewTask()
      .name("Staff and Customers - 3")
      .key('joins03')
      .scaffold("-- Your Query Below --")
      .question(ExSet.ex3)
      .database('sakila01')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: SakilaDatabase.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('StaffAndCustomers-1')
        .orderedEntries()
        .expectedData(ExSet.ex3data)
    .done(),
  ]
}
