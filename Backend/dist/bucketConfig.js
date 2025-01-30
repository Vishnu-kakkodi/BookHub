"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET_NAME'
];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});
const s3 = new client_s3_1.S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
const allowedDocumentTypes = ['application/pdf'];
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                contentType: file.mimetype
            });
        },
        key: (req, file, cb) => {
            let folderPath;
            console.log("Haiiiii");
            switch (file.fieldname) {
                case 'thumbnail':
                    folderPath = 'book_thumbnails';
                    break;
                case 'thumbnailQuiz':
                    folderPath = 'quiz_thumbnails';
                    break;
                case 'profileImage':
                    folderPath = 'user_profiles';
                    break;
                case 'video':
                    folderPath = 'institution_videos';
                    break;
                case 'document':
                    folderPath = 'institution_documents';
                    break;
                case 'profilePhoto':
                    folderPath = 'user_photo';
                    break;
                case 'profilePic':
                    folderPath = 'tutor_photo';
                    break;
                default:
                    folderPath = 'other_files';
            }
            const fileName = `${folderPath}/${new Date().getFullYear()}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            cb(null, fileName);
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    }),
    limits: {
        fileSize: 1000 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'thumbnail') {
            if (allowedImageTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only JPEG, PNG, and GIF files are allowed for thumbnails'));
            }
        }
        else if (file.fieldname === 'document') {
            if (allowedDocumentTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only PDF files are allowed for documents'));
            }
        }
        else {
            cb(null, true);
        }
    },
});
exports.default = upload;
//# sourceMappingURL=bucketConfig.js.map