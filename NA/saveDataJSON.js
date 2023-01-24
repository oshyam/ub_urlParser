const fs = require('fs');
const path = require('path');

const inputDir = './output'; // directory containing the JavaScript files
const outputDir = './output/jsonData'; // directory to store the JSON files

// create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// read all files in input directory
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    // process each file
    files.forEach(file => {
        const filePath = path.join(inputDir, file);

        // read the file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            // extract the URLs
            const urls = extractUrls(data);

            // create the JSON object
            const jsonData = {
                filename: file,
                domains: urls
            };

            // write the JSON to a file
            fs.writeFile(path.join(outputDir, file + '.json'), JSON.stringify(jsonData), err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`${file} processed successfully`);
                }
            });
        });
    });
});

function extractUrls(data) {
    // regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return data.match(urlRegex);
}
