import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';



import { FuncsExercises as ExSet } from './funcs/Exported.ts'
import { SqliteCommands } from '../../SQLiteProxy.ts';
import { SakilaDatabase } from '../../samples/Sakila.ts';

export const Exercises: ExercisePack = {
  topic: 'Functions',
  description: 'Functions Challenges',
  tasks: [
    NewTask()
      .name("Fullnames - 1")
      .key('funcs01')
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
        .test('Fullname-1')
        .orderedEntries()
        .expectedData(ExSet.ex1data)
    .done(),
    NewTask()
      .name("Length Of Names - 2")
      .key('funcs02')
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
        .test('Length-1')
        .orderedEntries()
        .expectedData(ExSet.ex2data)
    .done(),
    NewTask()
      .name("Capitalisation - 3")
      .key('funcs03')
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
        .test('Capitalisation-1')
        .orderedEntries()
        .expectedData(ExSet.ex3data)
    .done(),
  ]
}

