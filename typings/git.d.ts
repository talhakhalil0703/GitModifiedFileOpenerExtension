import * as vscode from "vscode";

export interface API {
  repositories: Repository[];
}

export interface Repository {
  state: {
    indexChanges: ResourceChange[]; // an array of staged changes
    workingTreeChanges: ResourceChange[]; // an array of modified changes
  };
  rootUri: vscode.Uri; // the URI of the repository root
}

/* From: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/git.d.ts#L79 */
export const enum Status {
    INDEX_MODIFIED,
	INDEX_ADDED,
	INDEX_DELETED,
	INDEX_RENAMED,
	INDEX_COPIED,

	MODIFIED,
	DELETED,
	UNTRACKED,
	IGNORED,
	INTENT_TO_ADD,
	INTENT_TO_RENAME,
	TYPE_CHANGED,

	ADDED_BY_US,
	ADDED_BY_THEM,
	DELETED_BY_US,
	DELETED_BY_THEM,
	BOTH_ADDED,
	BOTH_DELETED,
	BOTH_MODIFIED
}

export interface ResourceChange {
  uri: vscode.Uri;
  status: Status; // the status of the change, e.g., MODIFIED, DELETED, etc.
}
