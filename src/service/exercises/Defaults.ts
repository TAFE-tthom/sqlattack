import { TaskPackage } from '../../TaskAggregate';

import { Exercises as IntroPack } from './IntroExercises.ts'
import { Exercises as DMLPack } from './DMLExercises.ts'
import { Exercises as DDLPack } from './DDLExercises.ts'
import { Exercises as JoinsPack } from './JoinsExercises.ts'

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
      DMLPack,
      JoinsPack,
    ]; 
  }
  
}
