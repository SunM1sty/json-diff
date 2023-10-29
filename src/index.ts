import * as fs from 'fs'
import { PathFinder } from './PathFinder'
import { LoggerService } from './LoggerService'

type JSONKey = string | number | symbol

type JSONWithPath<T> = { path: string; json: Record<JSONKey, T> }
type JSONArray<T extends object> = Array<JSONWithPath<T>>
type KeyCounter = Record<JSONKey, string[]>
type JsonWithMissingKeys = {
  path: string
  missingKeys: string[]
}

export class JsonDifference<T extends object> {
  private _fileRoutes: string[] = []
  private _jsonArray: JSONArray<T> = []
  private _keyCounter: KeyCounter = {}
  private _jSONWithMissingKeysArray: JsonWithMissingKeys[] = []

  private _pathFinder: PathFinder = new PathFinder()
  private _logger: LoggerService = new LoggerService()

  constructor(paths: string[]) {
    this._jsonArray = []
    this._fileRoutes = this._pathFinder.parseRoutes(paths).extractJsonFilesFromFolder().fileRoutes
    this._logger.logInfo(
      `Instance of JsonDifference was invoked with following file routes:\n${this.fileRoutes.join(
        '\n'
      )}`
    )
  }

  get fileRoutes(): string[] {
    return this._fileRoutes
  }

  get keyCounter(): KeyCounter {
    return this._keyCounter
  }

  get jsonArray(): JSONArray<T> {
    return this._jsonArray
  }

  get jsonWithMissingKeysArray(): JsonWithMissingKeys[] {
    console.log(this._jSONWithMissingKeysArray)

    return this._jSONWithMissingKeysArray
  }

  private pushToJsonArray(json: JSONWithPath<T>) {
    this._jsonArray.push(json)
    return this
  }

  private pushToJsonWithMissingKeysArray(json: JsonWithMissingKeys) {
    this._jSONWithMissingKeysArray.push(json)
    return this
  }

  public copyJsonData() {
    this.fileRoutes.forEach(route => {
      const jsonString = fs.readFileSync(route, 'utf8')
      try {
        const json = JSON.parse(jsonString)
        this.pushToJsonArray({ path: route, json: json })
      } catch (error) {
        this._logger.logError(`Error occurred while pasring json: ${route}`)
        throw new Error(`Error occurred while pasring json: ${route}`)
      }
    })

    return this
  }

  public encountKeys() {
    this.jsonArray.forEach(jsonWithPath => {
      for (const key in jsonWithPath.json) {
        if (!this._keyCounter[key]) {
          this._keyCounter[key] = [jsonWithPath.path]
        } else {
          this._keyCounter[key] = [...this._keyCounter[key], jsonWithPath.path]
        }
      }
    })

    return this
  }

  public findMissingKeys() {
    this.jsonArray.forEach(jsonWithPath => {
      const jsonWithMissingKeys: JsonWithMissingKeys = {
        path: jsonWithPath.path,
        missingKeys: []
      }

      for (const key in this.keyCounter) {
        if (!jsonWithPath.json[key]) {
          jsonWithMissingKeys.missingKeys.push(key)
        }
      }

      if (jsonWithMissingKeys.missingKeys.length) {
        this.pushToJsonWithMissingKeysArray(jsonWithMissingKeys)
      }
    })

    return this
  }
}
