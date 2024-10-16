import multer from 'multer';
import { Router } from 'express';
import { uploadMedia , getMediaInfo } from '../controllers/media-controller';

const router = Router();
const upload = multer(); // Multer'ı kullanarak dosya yüklemeyi tanımlıyoruz

// POST isteği: Dosya alanı 'file' olarak tanımlı
router.post('/media', upload.single('file'), uploadMedia);

router.get('/media-info', getMediaInfo); // GET isteğiyle medya bilgilerini alma


export default router;
