const multer = require('multer');
const supabase = require('../config/supabaseClient');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilterImage = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont autorisées'), false);
};

const fileFilterReport = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Seuls les fichiers image ou PDF sont autorisés.'), false);
};

const profileUpload = multer({ storage, fileFilter: fileFilterImage }).single('profile');
const eventUpload = multer({ storage, fileFilter: fileFilterImage }).array('images');
const eventUploads = multer({ storage, fileFilter: fileFilterImage }).single('image');
const newsUpload = multer({ storage, fileFilter: fileFilterImage }).single('news');
const reportUpload = multer({ storage, fileFilter: fileFilterReport }).array('files');
const bannerUpload = multer({ storage, fileFilter: fileFilterImage }).single('banner');

async function uploadToSupabase(bucket, file) {
    try {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;

        const { error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(uniqueName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: urlError } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(uniqueName);

        if (urlError) throw urlError;

        return {
            publicUrl: publicUrlData.publicUrl,
            path: uniqueName
        };
    } catch (err) {
        console.error(`[uploadToSupabase] ❌ Erreur d'upload vers ${bucket} :`, err.message);
        throw new Error("Échec de l'upload du fichier sur Supabase Storage.");
    }
}

async function deleteFromSupabase(bucket, filePath) {
    try {
        const { error } = await supabase
            .storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;

        console.log(`[deleteFromSupabase] ✅ Fichier supprimé de ${bucket} : ${filePath}`);
    } catch (err) {
        console.error(`[deleteFromSupabase] ❌ Erreur suppression ${filePath} :`, err.message);
        throw new Error("Échec de la suppression du fichier sur Supabase Storage.");
    }
}

module.exports = {
    profileUpload,
    eventUpload,
    eventUploads,
    newsUpload,
    reportUpload,
    bannerUpload,
    uploadToSupabase,
    deleteFromSupabase
};