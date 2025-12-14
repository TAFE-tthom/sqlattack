import { ExercisePack, ExercisePacks } from './exercises/Defaults'


/**
 * PackageService
 * is used as an interface to retrieve and provide a list of task
 * packages to the application
 */
export interface PackageService {

  getPackages(): Array<ExercisePack>
  
}

/**
 * MockPackageService
 * Used to assist with demonstrating the prototype of the
 * package service an the whole app
 */
export class MockPackageService implements PackageService {

  /**
   * Gets all the exercise packs
   */
  getPackages() {
    return ExercisePacks.GetAllPacks();
  }
}

/**
 * Swappable instance within its own file to ensure we
 * can update this to use a valid one later
 */
export const PackageServiceHandler: PackageService =
  new MockPackageService();
