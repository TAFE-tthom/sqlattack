import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';



import { JoinsExercises as ExSet } from './joins/Exported.ts'
import { SqliteCommands } from '../../SQLiteProxy.ts';
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
  ]
}
