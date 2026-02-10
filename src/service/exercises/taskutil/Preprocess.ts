
import { PreprocessorObject } from '../../../objs/Preprocess';

/** ReplacementPair type */
export type ReplacementPair = [string, string];

/** TextReplacementBuilder, used to build terms */
export class TextReplacementBuilder {

  replacePairs: Array<ReplacementPair> = [];

  add(toMatch: string, replaceWith: string) {
    this.replacePairs.push([toMatch, replaceWith]);
    return this;
  }
  
  build() {
    return new TextReplacementPreprocessor(this.replacePairs);
  }
}


/** TextReplacementPreprocessor */
export class TextReplacementPreprocessor implements PreprocessorObject {

  replacementPairs: Array<ReplacementPair> = [];

  constructor(replacementPairs: Array<ReplacementPair>) {
    this.replacementPairs = replacementPairs;
  }

  static Start() {
    return new TextReplacementBuilder();
  }


  operateOn(answer: string) {
    let output = answer;

    for(const pair of this.replacementPairs) {
      const [toMatch, replaceWith] = pair;
      //@ts-ignore - For some reason the tsconfig is not picking up this method
      output = output.replaceAll(toMatch, replaceWith);
    }

    return output;
  }

  
  
  
}
