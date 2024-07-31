const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadFolder = path.join(__dirname, 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 16 * 1024 * 1024 }, // 16 MB max upload size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images and videos only!');
        }
    }
});
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.redirect('/uploads');
    }
    res.redirect('/uploads');
});

app.get('/uploads', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            console.error(err);
            files = [];
        }
        res.render('uploads', { files });
    });
});

// Placeholder route
app.get('/about', (req, res) => {
    res.send('<h1>About Us Page</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
