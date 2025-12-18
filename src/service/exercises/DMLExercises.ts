import { ExercisePack } from './Defaults';
import { NewTask } from './util/EvalMaker';
import { PointOfSaleDB }
  from '../../samples/PointOfSaleDB';
import { SqliteCommands } from '../../SQLiteProxy';

import { DMLExercises } from './dml/Exported.ts'

export const Exercises: ExercisePack = {
  topic: 'DML',
  description: 'Data Manipulation Language',
  tasks: [
    NewTask()
      .name("Insert Product - 1")
      .key('dml01')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex1)
      .database('insert01')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('one-product-1')
        .dataManipulationEval()
        .selectStatement("SELECT product_id, name, price FROM Product;")
        .expectedData(DMLExercises.ex1data)
    .done(),
    NewTask()
      .name("Insert Product - 2")
      .key('dml02')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex2)
      .database('insert02')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('many-products-1')
        .dataManipulationEval()
        .selectStatement("SELECT product_id, name, price FROM Product;")
        .expectedData(DMLExercises.ex2data)
    .done(),
    NewTask()
      .name("Update Products - 4")
      .key('dml03')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex3)
      .database('update03')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('update-products-1')
        .dataManipulationEval()
        .selectStatement("SELECT product_id, name, price FROM Product;")
        .expectedData(DMLExercises.ex3data)
    .done(),
    NewTask()
      .name("Delete Products - 4")
      .key('dml04')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex4)
      .database('delete04')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: PointOfSaleDB.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('delete-products-1')
        .dataManipulationEval()
        .selectStatement("SELECT product_id, name, price FROM Product;")
        .expectedData(DMLExercises.ex4data)
    .done(),
  ]
};
