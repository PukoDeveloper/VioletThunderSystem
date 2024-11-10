const fs = require('fs');
const semver = require('semver');
const express = require('express');
const app = express();
const port = 4000;

if (!fs.existsSync('VioletThunder')) {
    throw new Error('VioletThunder folder not found.');
}

const extensions = [];
const exdir = fs.readdirSync('VioletThunder/extensions');
for (let ex of exdir) {
    if (!fs.statSync('VioletThunder/extensions/' + ex).isDirectory()) continue;
    if (!fs.existsSync('VioletThunder/extensions/' + ex + '/package.json')) continue;
    const expackage = JSON.parse(fs.readFileSync('VioletThunder/extensions/' + ex + '/package.json'));
    expackage.path = 'extensions/' + ex;
    let index = -1;
    for (let i = 0; i < extensions.length; i++) {
        if (extensions[i].package === expackage.package) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        console.warn(`Duplicate package name detected: ${expackage.package}. Please check your extension packs.`);
        if (semver.satisfies(expackage.version, extensions[index].version)) {
            extensions[index] = expackage;
        }
    }
    else {
        extensions.push(expackage);
    }
}

app.use(express.static('VioletThunder'));

app.get('/extensions', (req, res) => {
    res.json(extensions);
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
