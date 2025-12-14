import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';
import { SakilaDatabase } from '../../samples/Sakila'
import { SqliteCommands } from '../../SQLiteProxy';

import { DMLExercises } from './dml/Exported.ts'

export const Exercises: ExercisePack = {
  topic: 'DML',
  description: 'Data Modelling Language',
  tasks: [
    NewTask()
      .name("Select Actors - 1")
      .key('dmlactors1')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml1)
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
        .test('AllActors-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml1json)
    .done(),
    NewTask()
      .name("Select Films - 2")
      .key('dmlfilms2')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml2)
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
        .test('PGFilms-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml2json)
    .done(),
    NewTask()
      .name("Select Cities - 3")
      .key('dmlcities3')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml3)
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
        .test('CititesF-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml3json)
    .done(),
    NewTask()
      .name("Select Cities - 4")
      .key('dmlcities4')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml4)
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
        .test('CititesFw23-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml4json)
    .done(),
    NewTask()
      .name("Select Films - 5")
      .key('dml5')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml5)
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
        .test('EpicFilms-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml5json)
    .done(),
    NewTask()
      .name("Allen Actors - 6")
      .key('dml6')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml6)
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
        .test('-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml6json)
    .done(),
    NewTask()
      .name("Customers@2 - 7")
      .key('dml7')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.dml7)
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
        .test('Store2Custoemrs-1')
        .orderedEntries()
        .expectedData(DMLExercises.dml7json)
    .done(),
  ],
  
}

