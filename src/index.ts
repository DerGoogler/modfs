type ModFSAllowedTypes = string | number | symbol | undefined | null | boolean;

interface IModFS<Entries> {
  format(template: string): string;
  formatEntries(): Entries;
  set entries(entries: Entries | undefined);
  get entries(): Entries | undefined;
  getEntrie<K extends keyof Entries>(key: K): Entries[K] | undefined;
  get<K extends keyof Entries>(key: K): Entries[K] | undefined;

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
    return template.replace(/\<(\w+(\.\w+)*)\>/gi, (match, key) => {
      const keys = key.split(".");
      let value: Entries | ModFSAllowedTypes = this._entries;
      for (const k of keys) {
        if (k in (value as any)) {
          value = value![k];
          if (typeof value !== "string") {
            return match;
          }
        } else {
          return match;
        }
      }

      if (typeof value === "function") {
        throw new TypeError("'value' cannot be a function");
      }

      return this.format(value as string);
    });
  }

  public static format<Entries>(template: string, entries?: Entries): string {
    return new ModFS(entries).format(template);
  }

  public formatEntries(): Entries {
    const formatValue = (value: any): any => {
      if (typeof value === "string") {
        return value.replace(/\<(\w+(\.\w+)*)\>/gi, (match, key) => {
          const keys = key.split(".");
          let tempValue = this._entries;
          for (const k of keys) {
            if (k in (tempValue as any)) {
              tempValue = tempValue![k];
            } else {
              return match;
            }
          }
          return formatValue(tempValue);
        });
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
      const formattedValue = formatValue(this._entries[key]);
      formattedObject[key] = formattedValue;
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

  public getEntrie<K extends keyof Entries>(key: K): Entries[K] | undefined {
    return this.formatEntries()[key];
  }

  public get<K extends keyof Entries>(key: K): Entries[K] | undefined {
    return this.getEntrie<K>(key);
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
