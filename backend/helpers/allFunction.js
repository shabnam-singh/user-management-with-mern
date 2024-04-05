const fs = require('fs');
const path = require('path');



function deleteProfileImage() {
    const folderPath = path.join(__dirname, '..', '..', 'Frontend Data', 'task1', 'src', 'images');
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        console.log('Files in folder:', files);

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                if (stats.isFile()) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted:', filePath);
                        }
                    });
                }
            });
        });
    });
}

module.exports={
    deleteProfileImage
}