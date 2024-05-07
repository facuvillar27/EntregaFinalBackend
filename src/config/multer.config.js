import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = file.fieldname;
        const folderMap = {
            profile: "profile",
            product: "product",
            document: "document"
        }
        const uploadPath = path.join(__dirname, "..", "uploads", folderMap[type] || "others");

        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export default upload;