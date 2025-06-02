import * as vscode from "vscode";

export interface API {
  repositories: Repository[];
}

export interface Repository {
  state: {
    indexChanges: ResourceChange[]; // an array of staged changes
    workingTreeChanges: ResourceChange[]; // an array of modified changes
  };
}

export interface ResourceChange {
  uri: vscode.Uri;
}
