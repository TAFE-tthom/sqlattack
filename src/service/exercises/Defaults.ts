import { TaskPackage } from '../../TaskAggregate';

import { Exercises as IntroPack } from './IntroExercises.ts'
import { Exercises as DQLPack } from './DQLExercises.ts'
import { Exercises as DDLPack } from './DDLExercises.ts'
import { Exercises as DMLPack } from './DMLExercises.ts'
import { Exercises as JoinsPack } from './JoinsExercises.ts'
import { Exercises as AggregatesPack } from './AggregatesExercises.ts'
import { Exercises as FunctionPack } from './FunctionExercises.ts'

/**
 * ExercisePack that will hold onto the
 * topic name and description
 * the tasks will 
 */
export interface ExercisePack {
  topic: string,
  description: string,
  tasks: Array<TaskPackage>
}


export class ExercisePacks {

  /**
   * Gets all mthe exercises from other
   * files which contain the exercises
   * for a relevant section
   */
  static GetAllPacks(): Array<ExercisePack> {
    return [
      IntroPack,
      DDLPack,
      DQLPack,
      DMLPack,
      FunctionPack,
      JoinsPack,
      AggregatesPack
    ]; 
  }
  
}
