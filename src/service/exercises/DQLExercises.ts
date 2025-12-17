import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';
import { SakilaDatabase } from '../../samples/Sakila'
import { SqliteCommands } from '../../SQLiteProxy';

import { DQLExercises } from './dql/Exported.ts'

export const Exercises: ExercisePack = {
  topic: 'DQL',
  description: 'Data Query Language',
  tasks: [
    NewTask()
      .name("Select Actors - 1")
      .key('dqlactors1')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql1)
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
      .evaluation("DQL")
        .test('AllActors-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql1json)
    .done(),
    NewTask()
      .name("Select Films - 2")
      .key('dqlfilms2')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql2)
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
      .evaluation("DQL")
        .test('PGFilms-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql2json)
    .done(),
    NewTask()
      .name("Select Cities - 3")
      .key('dqlcities3')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql3)
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
      .evaluation("DQL")
        .test('CititesF-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql3json)
    .done(),
    NewTask()
      .name("Select Cities - 4")
      .key('dqlcities4')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql4)
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
      .evaluation("DQL")
        .test('CititesFw23-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql4json)
    .done(),
    NewTask()
      .name("Select Films - 5")
      .key('dql5')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql5)
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
      .evaluation("DQL")
        .test('EpicFilms-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql5json)
    .done(),
    NewTask()
      .name("Allen Actors - 6")
      .key('dql6')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql6)
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
      .evaluation("DQL")
        .test('-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql6json)
    .done(),
    NewTask()
      .name("Customers@2 - 7")
      .key('dql7')
      .scaffold("-- Your Query Below --")
      .question(DQLExercises.dql7)
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
      .evaluation("DQL")
        .test('Store2Custoemrs-1')
        .orderedEntries()
        .expectedData(DQLExercises.dql7json)
    .done(),
  ],
  
}

