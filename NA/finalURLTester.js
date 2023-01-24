const fs = require("fs");
const path = require("path");

const inputFolder = "./jsonFiles";
const outputFolder = "./output/addDataPathtoIgnore";

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
                const urls = jsonData.domains || [];
                const uniqueUrls = [...new Set(urls)];
                const fileName = path.basename(file, path.extname(file)) + '.txt';
                fs.mkdir(outputFolder, { recursive: true }, (err) => {
                    if (err) {
                        console.error(`Error creating output folder: ${err}`);
                        return;
                    }

                    fs.writeFile(path.join(outputFolder, fileName), uniqueUrls.join("\n"), err => {
                        console.log("Done");
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
