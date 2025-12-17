import { ExercisePack } from './Defaults';

import { NewTask }
  from './util/EvalMaker';

import { IntroExercises }
  from './intro/Exported';

import { UsersDB }
  from '../../samples/UsersDB';
import { SqliteCommands } from '../../SQLiteProxy';


export const Exercises: ExercisePack = {
  topic: 'Introduction',
  description: 'Introduction to SQL',
  tasks: [
    NewTask()
      .name("Hello World - 1")
      .key('intr1')
      .scaffold("-- Your Code Here --")
      .question(IntroExercises.intr1)
      .database('helloworld01')
      .setup()
        .skip()
      .evaluation("DML")
        .test('helloworld-1')
        .orderedEntries()
        .expectedData(IntroExercises.intr1_data)
    .done(),
    NewTask()
      .name("Multi-Columns - 2")
      .key('intr2')
      .scaffold("-- Multi Columns Code Here --")
      .question(IntroExercises.intr2)
      .database('multicolumns01')
      .setup()
        .skip()
      .evaluation("DML")
        .test('multicolumns-1')
        .orderedEntries()
        .expectedData(IntroExercises.intr2_data)
    .done(),
    NewTask()
      .name("Querying A Table - 3")
      .key('intr3')
      .scaffold("-- Your Query Here --")
      .question(IntroExercises.intr3)
      .database('usersdb01')
      .setup()
        .add({
          command: SqliteCommands.Exec,
          operation: UsersDB.getSchema(),
          extra: []
        })
        .add({
          command: SqliteCommands.Exec,
          operation: UsersDB.getInsertData(),
          extra: []
        })
      .skip()
      .evaluation("DML")
        .test('queryingdb-1')
        .orderedEntries()
        .expectedData(IntroExercises.intr3_data)
    .done(),
  ]
}

