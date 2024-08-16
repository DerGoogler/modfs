type ModFSAllowedTypes = string | number | symbol | undefined | null | boolean;

interface IModFS<Entries> {
  format(template: string): string;
  formatEntries(): Entries;
  set entries(entries: Entries | undefined);
  get entries(): Entries | undefined;
  getEntry<K extends keyof Entries>(key: K): Entries[K] | undefined;
  get<K extends keyof Entries>(key: K): any;

  stringify(replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;

  stringify(replacer?: (number | string)[] | null, space?: string | number): string;

  stringifyEntries(replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;

  stringifyEntries(replacer?: (number | string)[] | null, space?: string | number): string;
}

class ModFS<Entries> implements IModFS<Entries> {
  private _entries: Entries | undefined;

  public constructor(entries?: Entries) {
    this._entries = entries;
  }

  public format(template: string): string {
    const resolveKey = (key: string): string | undefined => {
      const keys = key.split(".");
      let value: Entries | ModFSAllowedTypes = this._entries;
      for (const k of keys) {
        if (k in (value as any)) {
          value = value![k];
        } else {
          return undefined;
        }
      }
      if (typeof value === "string") {
        return value;
      } else {
        return String(value);
      }
    };

    const formatArray = (key: string, separator: string): string | undefined => {
      const keys = key.split(".");
      let value: Entries | ModFSAllowedTypes = this._entries;
      for (const k of keys) {
        if (k in (value as any)) {
          value = value![k];
        } else {
          return undefined;
        }
      }
      if (Array.isArray(value)) {
        return value.join(separator);
      } else {
        return undefined;
      }
    };

    let formatted = template;
    let previous: string;
    do {
      previous = formatted;
      formatted = formatted.replace(/\<(\w+(\.\w+)*)(\((.*?)\))?\>/gi, (match, key, _, __, separator) => {
        if (separator !== undefined) {
          const arrayValue = formatArray(key, separator);
          return arrayValue !== undefined ? arrayValue : match;
        } else {
          const value = resolveKey(key);
          return value !== undefined ? value : match;
        }
      });
    } while (formatted !== previous);

    return formatted;
  }

  public static format<Entries>(template: string, entries?: Entries): string {
    return new ModFS(entries).format(template);
  }

  public formatEntries(): Entries {
    const formatValue = (value: any): any => {
      if (typeof value === "string") {
        return this.format(value);
      } else if (Array.isArray(value)) {
        return value.map((item: any) => formatValue(item));
      } else if (typeof value === "object" && value !== null) {
        const formattedObject: any = {};
        for (const prop in value) {
          formattedObject[prop] = formatValue(value[prop]);
        }
        return formattedObject;
      }
      return value;
    };

    const formattedObject: any = {};
    for (const key in this._entries) {
      formattedObject[key] = formatValue(this._entries[key]);
    }
    return formattedObject;
  }

  public static formatEntries<Entries>(entries: Entries): Entries {
    return new ModFS(entries).formatEntries();
  }

  public set entries(entries: Entries) {
    this._entries = entries;
  }

  public get entries(): Entries | undefined {
    return this._entries;
  }

  public getEntry<K extends keyof Entries>(key: K): Entries[K] | undefined {
    return this.get<K>(key);
  }

  public get<K extends keyof Entries>(key: K): any {
    const keys = (key as string).split(".");
    let value: any = this._entries;

    for (const k of keys) {
      if (value && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    if (typeof value === "string") {
      return this.format(value);
    }

    return this.formatEntries()[key];
  }

  public stringify(replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
  public stringify(replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
  public stringify(replacer?: any, space?: any): string {
    return JSON.stringify(this._entries, replacer, space);
  }

  public stringifyEntries(replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
  public stringifyEntries(replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
  public stringifyEntries(replacer?: any, space?: any): string {
    return JSON.stringify(this.formatEntries(), replacer, space);
  }
}

export default ModFS;
