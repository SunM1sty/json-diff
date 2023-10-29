import * as fs from 'fs'
import * as path from 'path'

export class PathFinder {
  private _fileRoutes: string[] = []
  private _folderRoutes: string[] = []

  constructor() {
    this._fileRoutes = []
    this._folderRoutes = []
  }

  get fileRoutes(): string[] {
    return this._fileRoutes
  }

  private pushToFileRoutes(paths: string[]) {
    this._fileRoutes = this._fileRoutes.concat(paths)
    return this
  }

  get folderRoutes(): string[] {
    return this._folderRoutes
  }

  private pushToFolderRoutes(paths: string[]) {
    this._folderRoutes = this._folderRoutes.concat(paths)
    return this
  }

  private isFilePathAlreadyIncludes(path: string): boolean {
    return this.fileRoutes.includes(path)
  }

  public parseRoutes(paths: string[]) {
    const jsonFilePaths: string[] = []
    const folderPaths: string[] = []

    paths.forEach(path => {
      if (path.endsWith('.json')) {
        jsonFilePaths.push(path)
      } else if (fs.statSync(path).isDirectory()) {
        folderPaths.push(path)
      }
    })

    if (jsonFilePaths.length) {
      this.pushToFileRoutes(jsonFilePaths)
    }

    if (folderPaths.length) {
      this.pushToFolderRoutes(folderPaths)
    }

    return this
  }

  public extractJsonFilesFromFolder() {
    const fileRoutes: string[] = []

    this._folderRoutes.forEach(folder => {
      void fs.readdirSync(folder).filter(file => {
        if (file.endsWith('.json') && !this.isFilePathAlreadyIncludes(path.join(folder, file))) {
          fileRoutes.push(path.join(folder, file))
        }
      })
    })

    this.pushToFileRoutes(fileRoutes)

    return this
  }
}
