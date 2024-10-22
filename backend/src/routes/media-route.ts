import multer from 'multer';
import { Router } from 'express';
import { uploadMedia , getMediaInfo, getVideoById , deleteCandidateAndMedia } from '../controllers/media-controller';

const router = Router();
const upload = multer(); // Multer'ı kullanarak dosya yüklemeyi tanımlıyoruz

// POST isteği: Dosya alanı 'file' olarak tanımlı
router.post('/media/:formId', upload.single('file'), uploadMedia);

router.get('/media-info', getMediaInfo); // GET isteğiyle medya bilgilerini alma

router.post('/video-url', getVideoById);

router.delete('/delete-candidate-media', deleteCandidateAndMedia);

export default router;
