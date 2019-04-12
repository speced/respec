module "core/xref" {
  export interface RequestEntry {
    term: string;
    hash: string;
    types: string[];
    specs?: string[];
    for?: string;
  }

  export interface SearchResultEntry {
    uri: string;
    shortname: string;
    spec: string;
    type: string;
    normative: boolean;
    for?: string[];
  }

  export interface Response {
    result: {
      [hash: string]: SearchResultEntry[];
    };
    query?: RequestEntry[];
  }
}
