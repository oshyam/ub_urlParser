const fs = require("fs");
const path = require("path");

const inputFolder = "./jsonFiles";
const outputFolder = "./output/saveDB";

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error(`Error reading input folder: ${err}`);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(inputFolder, file);
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error(`Error reading file: ${file} ${err}`);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                const blockedUrls = jsonData.Blocked_Urls || [];
                const allowedUrls = jsonData.Allowed_Urls || [];
                const notLiveUrls = jsonData.Not_Live_Urls || [];
                const allUrls = [...blockedUrls, ...allowedUrls, ...notLiveUrls];

                const uniqueUrls = [...new Set(allUrls)];
                const modifiedUrls = uniqueUrls.map(url => url.replace(/^https?:\/\//i, ''));
                const fileName = path.basename(file, path.extname(file)) + '.js';
                fs.mkdir(outputFolder, { recursive: true }, (err) => {
                    if (err) {
                        console.error(`Error creating output folder: ${err}`);
                        return;
                    }
                    fs.writeFile(path.join(outputFolder, fileName), JSON.stringify(modifiedUrls), err => {
                        if (err) {
                            console.error(`Error writing file: ${file} ${err}`);
                        }
                    });
                });
            } catch (err) {
                console.error(`Error parsing JSON: ${file} ${err}`);
            }
        });
    });
});
