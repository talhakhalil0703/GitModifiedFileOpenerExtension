import * as vscode from "vscode";

import { API as GitAPI, Repository, ResourceChange, Status } from "../typings/git";

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.openModifiedFiles",
    async () => {
      const gitExtension = vscode.extensions.getExtension<{
        getAPI(version: number): GitAPI;
      }>("vscode.git");

      if (!gitExtension) {
        vscode.window.showErrorMessage("Git extension not found");
        return;
      }

      const git = gitExtension.isActive
        ? gitExtension.exports.getAPI(1)
        : (await gitExtension.activate()).getAPI(1);

      const repos: Repository[] = git.repositories;
      if (repos.length === 0) {
        vscode.window.showInformationMessage("No Git repo detected");
        return;
      }

      /* Iterate through all the repositories. */

      var modifiedFiles: ResourceChange[] = [];
      var stagedFiles: ResourceChange[] = [];
      for (const repo of repos){
        /* Find all the modified and staged files in this repo and add it to our
        modified and staged arrays. */
        const modified = repo.state.workingTreeChanges;
        const staged = repo.state.indexChanges;
        modifiedFiles = modifiedFiles.concat(modified);
        stagedFiles = stagedFiles.concat(staged);
      }

      console.log("Modified files: ", modifiedFiles);
      console.debug("Staged files: ", stagedFiles);

      const allChanges = [...modifiedFiles, ...stagedFiles];

      /* We're going to go through all the changes, and remove the ones that indicate a file was deleted. */
      /* This can be done by looking at the status and seeing if it is 'DELETED' or 'INDEX_DELETED'. */
      const filteredChanges = allChanges.filter(
        (change) =>
          change.status !== Status.DELETED &&
          change.status !== Status.INDEX_DELETED
      );

      console.log(
        "Filtered changes (no deleted files): ",
        filteredChanges
      );

      if (filteredChanges.length === 0) {
        vscode.window.showInformationMessage(
          "No modified or staged files found."
        );
        return;
      }

      /* Open each file in the editor. */
      for (const change of filteredChanges) {
        const doc = await vscode.workspace.openTextDocument(change.uri);
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
