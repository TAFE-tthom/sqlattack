
import { ReactElement } from 'preact/compat';
import { ColumnNames, DatabaseProxy, EvaluationTest, ResultEntry, ResultRow }
  from '../../../TaskAggregate';
import { diffChars } from 'diff';
import React from 'react';


/**
 * Allows for transforming the row by taking the row
 * and specify the transformer operation
 */
export function TransformRow(row: Array<any>) {
  return {
    FormatRowAsCSVString: () => FormatRowAsCSVString(row)
  }
}

export function FormatRowAsCSVEntry(row: Array<any>) {
  
  let csvstr = '';
  for(let i = 0; i < row.length-1; i++) {
    csvstr += `${row[i]},`
  }
  csvstr += `${row[row.length-1]}`
  return csvstr;
}

/**
 * Formats the row as a csv string
 */
export function FormatRowAsCSVString(row: Array<any>) {
  return FormatRowAsCSVEntry(row) + '\n';
}

/**
 * Flatten the rows into a string
 */
export function FlattenRows(rows: Array<string>) {
  let rowStr = '';
  
  for(let i = 0; i < rows.length; i++) {
    rowStr += `${rows[i]}`
  }
  return rowStr;
}

/**
 * Assists with constructing the data
 */
export function InsertIntoFormat(table: string,
  fields: Array<string>, rows: Array<Array<any>>) {

  const fmtFields = FormatRowAsCSVEntry(fields);
  let formatInsert = `INSERT INTO ${table}(${fmtFields}) \nVALUES`
  for(let i = 0; i < rows.length; i++) {
    if(i < (rows.length-1)) {
      
    }
    const fmtRow = FormatRowAsCSVEntry(rows[i]);
    const insertValues = `(${fmtRow})`;
    if(i < (rows.length-1)) {
      formatInsert += insertValues + ',';
      
    } else {
      formatInsert += insertValues;
    }
  }
  
  return formatInsert;
}

/**
 * Boring utility function to convert a string array to a string
 */
export function StringArrayToString(
  sarray: string[]) {

  let s = '';

  for(let i = 0; i < sarray.length; i++) {
    s += '' + sarray[i];
  }

  return s;
}

/**
 * Utilised on DML related statements
 * Will require a select statement to be issues
 */
export async function DataManipulationEvaluation(  
  columns: ColumnNames,
  _resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  dbProxy: DatabaseProxy): Promise<ResultEntry> {

  const query = expectedData.extra[0]; //Expected
  const statements = query.query;  
  const results = await dbProxy.query(statements);

  return OrderedEntriesEvaluationTest(columns, results, expectedData, dbProxy);
}

/**
 * OrderedEntriesEvaluation + Checks if the column names are correct
 */
export async function OrderedEntriesEvaluationWithColumnNameTest(
  columns: ColumnNames,
  resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  dbProxy: DatabaseProxy): Promise<ResultEntry> {

  // Transforms it and pushes it into the output to be compared
  resultData.unshift({
    row: columns
  });

  expectedData.rows.unshift({
    row: expectedData.columns
  });

  return OrderedEntriesEvaluationTest(columns, resultData, expectedData, dbProxy);
} 

/**
 * This function is used to throw data at
 * construction and check to see if it is working
 */
export async function TableConstructionEvaluation(
  columns: ColumnNames,
  _resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  dbProxy: DatabaseProxy): Promise<ResultEntry> {


  //format: queries
  const dbMap = dbProxy.getDatabaseIDMap();
  const queries = expectedData.extra;
  let results: Array<ResultRow> = [];

  for(const q of queries) {
    const meta = q as any;
    if(meta.kind === 'INSERT') {
      const { table, columns, values } = q;
      const statements = InsertIntoFormat(table, columns, values);
      
      dbProxy.execute(statements, dbMap.submission.dbId);
    } else if(meta.kind === 'SELECT') {
      // Last one, get the results out
      // What should we do? Use .check?
      const statements = q.query;
      
      results = await dbProxy.query(statements);
      
    }
  }
  return OrderedEntriesEvaluationTest(columns, results, expectedData, dbProxy);
}

/**
 * OrderedEntry checks, ensure that the same set that
 * is returned matches the expected order.
 */
export async function OrderedEntriesEvaluationTest(
  _columns: ColumnNames,
  resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  _dbProxy: DatabaseProxy): Promise<ResultEntry> {

  const respRows = resultData.map(r => TransformRow(r.row)
    .FormatRowAsCSVString());
  const epctRows = expectedData.rows.map(r => TransformRow(r.row)
    .FormatRowAsCSVString());



  const respTextOutput = FlattenRows(resultData
    .map(r => TransformRow(r.row).FormatRowAsCSVString()))
  const epctTextOutput = FlattenRows(expectedData.rows
    .map(r => TransformRow(r.row).FormatRowAsCSVString()))
  const result = respTextOutput === epctTextOutput;

  if(respRows.length > epctRows.length) {
    const diffRows = respRows.length - epctRows.length;
    for(let i = 0; i < diffRows; i++) {
      epctRows.push('');
    }
  } else {
    const diffRows = epctRows.length - respRows.length;
    for(let i = 0; i < diffRows; i++) {
      respRows.push('');
    }
    
  }

  let currentLineBuffer: Array<React.ReactElement> = []
  const diffData: Array<ReactElement> = [];
  const totalElements = epctRows.length;

  for(let i = 0; i < totalElements; i++) {
    const respText = respRows[i];
    const epctText = epctRows[i];
    diffChars(respText, epctText)
      .forEach((e) => {
        const p = e;

        if(p.value === "\n") {
          const newDiffObj = (
            <div className={'diffLineEntry'}>
              {currentLineBuffer};
            </div>
          );
          diffData.push(newDiffObj);
        
          currentLineBuffer = [];
        }
        let obj = (<span style={{color:'#ffffff'}}>{p.value}</span>);
        if(p.added) {
          obj = (<span style={{color:'#00ff00'}}>{p.value}</span>)
        } else if(p.removed) {
          obj = (<span style={{color:'#ff0000'}}>{p.value}</span>)
        }

        currentLineBuffer.push(obj);
      });

  }
  
  return {
    test: expectedData.test,
    actual: respTextOutput,
    expected: epctTextOutput,
    passed: result,
    diffData,
    
  }
}

/**
 * First entry of the result matching the first entry
 * of the expected
 */
export async function FirstEntryEvaluationTest(
  _columns: ColumnNames,
  resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  _dbProxy: DatabaseProxy) {

  let currentLineBuffer: Array<React.ReactElement> = []
  const diffData: Array<ReactElement> = [];
  
  const respText = resultData[0].row[0];
  const epctText = expectedData.rows[0].row[0];
  const result = respText === epctText;
  diffChars(respText, epctText)
      .forEach((e) => {
        const p = e;

        if(p.value === "\n") {
          const newDiffObj = (
            <div className={'diffLineEntry'}>
              {currentLineBuffer};
            </div>
          );
          diffData.push(newDiffObj);
        
          currentLineBuffer = [];
        }
        let obj = (<span style={{color:'#ffffff'}}>{p.value}</span>);
        if(p.added) {
          obj = (<span style={{color:'#00ff00'}}>{p.value}</span>)
        } else if(p.removed) {
          obj = (<span style={{color:'#ff0000'}}>{p.value}</span>)
        }

        currentLineBuffer.push(obj);
      });

  return {
    test: expectedData.test,
    actual: respText,
    expected: epctText,
    passed: result,
    diffData
    
  }
}
