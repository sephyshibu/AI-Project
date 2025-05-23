import multer from "multer";
import path from "path";


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const uploadPath = path.join(__dirname, '..', '..', 'upload', 'videofiles'); // Adjust as needed
        cb(null, uploadPath);
    },
    filename:function(req,file,cb){
        const uniqueName=Date.now()+"videofile"
        cb(null,uniqueName+path.extname(file.originalname))
    }
})

const fileFilter=(req:Express.Request,file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1000MB = 1GB limit
  },
});