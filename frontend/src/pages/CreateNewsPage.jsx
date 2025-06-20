import React, { useEffect, useState } from 'react';
import Stepper from '../components/CreateNews/Stepper';
import NewsStepOne from '../components/CreateNews/NewsStepOne';
import EventStepThree from '../components/CreateEvent/EventStepThree';
import useCreateNews from '../hooks/News/useCreateNews';
import useEventsByUser from '../hooks/Events/useEventsByUser';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Partials/Footer';
import Header from '../components/Partials/Header';
import Swal from 'sweetalert2';
import { useAuth } from '../config/authHeader';
import vector1 from '../assets/img/et-3-event-vector.svg';

const LOCAL_STORAGE_KEY = 'create_news_draft';

const CreateNewsPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categories: [],
        images: []
    });

    const { submitNews, loading, error } = useCreateNews();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { events, loading: loadingEvents, error: eventsError } = useEventsByUser();

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) setFormData(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const isStepOneValid = () => formData.title && formData.content && formData.categories.length > 0;

    const nextStep = () => {
        if (step === 1 && !isStepOneValid()) return;
        setStep(2);
    };

    const prevStep = () => setStep(1);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onFieldClick = (key) => {
        const stepOneFields = ['title', 'content', 'categories'];
        if (stepOneFields.includes(key)) setStep(1);
    };

    const onRemoveImage = (index) => {
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, images: updated }));
    };

    const handleSubmit = async () => {
        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('content', formData.content);
            payload.append('categories', JSON.stringify(formData.categories));
            if (formData.event_id) payload.append('event_id', formData.event_id);
            if (formData.image?.file) payload.append('image', formData.image.file);

            await submitNews(payload, user.token);
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            await Swal.fire({
                icon: 'success',
                title: 'News créée avec succès !',
                text: 'Votre actualité a été enregistrée.',
                confirmButtonText: 'Super !',
                confirmButtonColor: '#2563eb'
            });

            navigate('/');
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Une erreur est survenue lors de la création de la news.",
                confirmButtonText: 'Fermer'
            });
        }
    };

    return (
        <>
            <Header />
            <section style={{
                backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
            }}
                className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                    <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Création d'actualité</h1>
                    <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                        <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                        <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                        <li className="opacity-80 hover:text-blue-400 cursor-pointer">
                            <a href="/event-created">Création d'actualité</a>
                        </li>
                    </ul>
                </div>
            </section>
            <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 px-6 pb-20">
                <h1 className="text-4xl font-extrabold text-center mb-12 font-sans">Création d'une news</h1>

                <Stepper currentStep={step} />

                <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
                    {step === 1 && <NewsStepOne formData={formData} onChange={handleChange} events={events} loadingEvents={loadingEvents} />}
                    {step === 2 && (
                        <EventStepThree
                            data={formData}
                            images={formData.images}
                            onFieldClick={onFieldClick}
                            onRemoveImage={onRemoveImage}
                        />
                    )}

                    <div className="flex justify-between mt-12">
                        {step > 1 && (
                            <button onClick={prevStep} className="px-6 py-2 text-white bg-gray-400 rounded hover:bg-gray-500 transition">
                                Précédent
                            </button>
                        )}

                        {step === 1 && (
                            <div className="relative group">
                                <button
                                    onClick={nextStep}
                                    disabled={!isStepOneValid()}
                                    className={`px-6 py-2 rounded text-white transition duration-300 ${!isStepOneValid() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    Suivant
                                </button>
                                {!isStepOneValid() && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-md rounded px-4 py-2 text-sm text-gray-700 w-80 hidden group-hover:block z-10"
                                    >
                                        Remplissez tous les champs requis.
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded transition flex items-center gap-2"
                            >
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                )}
                                Créer la news
                            </button>
                        )}
                    </div>

                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateNewsPage;