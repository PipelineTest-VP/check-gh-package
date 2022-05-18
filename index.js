const core = require('@actions/core');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");

let octokit;

async function main() {
    try {
        const orgName = core.getInput('gthub-org-name');
        const gthubPackageType = core.getInput('gthub-package-type');
        const gthubPackageName = core.getInput('gthub-package-name');
        const gthubPackageVersion = core.getInput('gthub-package-version');
        const gthubToken = core.getInput('gthub-token');

        octokit = new Octokit({ auth: gthubToken });

        const response = await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
            package_type: gthubPackageType,
            package_name: gthubPackageName,
            org: orgName
        });

        console.log("response data: ", response.data);
        
        let isPackageFound = false;
        const packageVersions = response.data.length;
        for(let i = 0; i < packageVersions; i++) {
            if(gthubPackageType !== "container" && response.data[i].name === gthubPackageVersion.toString()) {
                isPackageFound = true;
                break;
            }

            if(gthubPackageType === "container" && response.data[i].metadata.container.tags.includes(gthubPackageVersion.toString())) {
                isPackageFound = true;
                break;
            }
        }
        console.log("IS_PACKAGE_FOUND: ", isPackageFound);

        core.exportVariable("IS_PACKAGE_FOUND", isPackageFound);
        
    } catch (error) {
        core.exportVariable("IS_PACKAGE_FOUND", false);
    }
}

main();
