import multer from "multer";

/*“We use Multer diskStorage to temporarily store 
uploaded files on the server so they 
can be processed or uploaded to cloud
 services like Cloudinary.”*/
 
//disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, })