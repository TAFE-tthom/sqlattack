
import { ReactElement } from 'preact/compat';
import { DatabaseProxy, EvaluationTest, ResultEntry, ResultRow }
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

/**
 * Formats the row as a csv string
 */
export function FormatRowAsCSVString(row: Array<any>) {
  let csvstr = '';
  for(let i = 0; i < row.length-1; i++) {
    csvstr += `${row[i]},`
  }
  csvstr += `${row[row.length-1]}`
  return csvstr;
}

/**
 * Flatten the rows into a string
 */
export function FlattenRows(rows: Array<string>) {
  let rowStr = '';
  
  for(let i = 0; i < rows.length; i++) {
    rowStr += `${rows[i]}\n`
  }
  return rowStr;
}

/**
 * Boring utility function to convert a string array to a string
 */
export function StringArrayToString(sarray: string[]) {
  let s = '';
  for(let i = 0; i < sarray.length; i++) {
    s += '' + sarray[i];
  }
  return s;
}
 
/**
 * OrderedEntry checks, ensure that the same set that
 * is returned matches the expected order.
 */
export async function OrderedEntriesEvaluationTest(
  resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  _dbProxy: DatabaseProxy): Promise<ResultEntry> {

  const respText = FlattenRows(resultData
    .map(r => TransformRow(r.row).FormatRowAsCSVString()))
  const epctText = FlattenRows(expectedData.rows
    .map(r => TransformRow(r.row).FormatRowAsCSVString()))
  const result = respText === epctText;

  const diffData: Array<ReactElement> = [];
  let currentLineBuffer: Array<React.ReactElement> = []
  let newBuffer = true;
  
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
    diffData,
    
  }
}

/**
 * First entry of the result matching the first entry
 * of the expected
 */
export async function FirstEntryEvaluationTest(
  resultData: Array<ResultRow>,
  expectedData: EvaluationTest,
  _dbProxy: DatabaseProxy) {

  
  const respText = resultData[0].row[0];
  const epctText = expectedData.rows[0].row[0];
  const result = respText === epctText;
  const diffData = diffChars(respText, epctText)
    .map(e => {
      const p = e as any;
      return p.added ? p.value.bgGreen :
        p.removed ? p.value.bgRed :
        p.value;
        
    })
    .reduce((p, c) => {
      return p + c;
    });

  return {
    test: expectedData.test,
    actual: respText,
    expected: epctText,
    passed: result,
    diffData
    
  }
}
