import { ExercisePack } from './Defaults';
import { NewTask } from './taskutil/EvalMaker';
import { PointOfSaleDB } from '../../samples/PointOfSaleDB';
import { NorthwindDB } from '../../samples/Northwind';
import { SqliteCommands } from '../../sql/SQLiteProxy';
import { DMLExercises } from './taskdata/dml/Exported.ts'

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
      .name("Update Products - 3")
      .key('dml03')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex3)
      .database('update03-fix1')
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
    NewTask()
      .name("Deleting An Order - 5")
      .key('dml05')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex5)
      .database('delete05')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: NorthwindDB.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: NorthwindDB.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('delete-orders-1')
        .dataManipulationEval()
        .selectStatement(`SELECT OrderID, CustomerID, EmployeeID FROM Orders ORDER BY OrderID ASC LIMIT 10;`)
        .expectedData(DMLExercises.ex5data)
    .done(),
    NewTask()
      .name("Update Order - 6")
      .key('dml06')
      .scaffold("-- Your Query Below --")
      .question(DMLExercises.ex6)
      .database('update06')
      .setup()
        .add({
            command: SqliteCommands.Exec,
            operation: NorthwindDB.getSchema(),
            extra: []
          })
        .add({
            command: SqliteCommands.Exec,
            operation: NorthwindDB.getInsertData(),
            extra: []
          })
        .skip()
      .evaluation("DML")
        .test('update-orders-1')
        .dataManipulationEval()
        .selectStatement(`SELECT OrderID, EmployeeID, CustomerID 
FROM Orders ORDER BY EmployeeID DESC, OrderID ASC LIMIT 32;`)
        .expectedData(DMLExercises.ex6data)
    .done(),
  ]
};
