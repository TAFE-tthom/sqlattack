import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';

import { AggregateExercises as ExSet }
  from './aggrs/Exported.ts'
import { SqliteCommands } from '../../SQLiteProxy.ts';
import { SakilaDatabase }
  from '../../samples/Sakila.ts';


export const Exercises: ExercisePack = {
  topic: 'Aggregation',
  description: 'Joins Challenges',
  tasks: [
    NewTask()
      .name("Counting Actors - 1")
      .key('aggractors1')
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
        .test('CountingActors-1')
        .orderedEntries()
        .expectedData(ExSet.ex1data)
    .done(),
    NewTask()
      .name("Smallest Payment - 2")
      .key('aggr02')
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
        .test('Smallest-1')
        .orderedEntries()
        .expectedData(ExSet.ex2data)
    .done(),
    NewTask()
      .name("Customers and Rentals - 3")
      .key('aggr03')
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
        .test('CountAggregate-1')
        .orderedEntries()
        .expectedData(ExSet.ex3data)
    .done(),
  ]
}

