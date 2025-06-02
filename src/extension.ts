import * as vscode from "vscode";

import { API as GitAPI, Repository } from "../typings/git";

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

      /* TODO: Handle multiple repos, and maybe ask the user to choose one? */
      const repo = repos[0];

      /* Get changes, staged and modified. */
      const modified = repo.state.workingTreeChanges;
      const staged = repo.state.indexChanges;

      const allChanges = [...modified, ...staged];

      if (allChanges.length === 0) {
        vscode.window.showInformationMessage(
          "No modified or staged files found."
        );
        return;
      }

      /* Open each file in the editor. */
      for (const change of allChanges) {
        const doc = await vscode.workspace.openTextDocument(change.uri);
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
}
