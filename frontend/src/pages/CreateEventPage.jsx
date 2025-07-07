import React, { useEffect, useState } from 'react';
import Stepper from '../components/CreateEvent/Stepper';
import EventStepOne from '../components/CreateEvent/EventStepOne';
import EventStepTwo from '../components/CreateEvent/EventStepTwo';
import EventStepThree from '../components/CreateEvent/EventStepThree';
import useCreateEvent from '../hooks/Events/useCreateEvent';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Partials/Footer';
import Header from '../components/Partials/Header';
import Swal from 'sweetalert2';

const LOCAL_STORAGE_KEY = 'create_event_draft';

const CreateEventPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        date: '',
        city: '',
        street: '',
        street_number: '',
        postal_code: '',
        start_time: '',
        end_time: '',
        max_participants: '',
        categories: [],
        images: []
    });

    const { handleCreateEvent, loading, error } = useCreateEvent();
    const navigate = useNavigate();

    const [citySelected, setCitySelected] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) setFormData(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [step]);

    const isStepOneValid = () => {
        const requiredFields = ['title', 'start_time', 'end_time', 'city', 'postal_code', 'street', 'street_number', 'categories'];
        const isComplete = requiredFields.every((field) => formData[field] && (Array.isArray(formData[field]) ? formData[field].length > 0 : true));

        if (!isComplete || !citySelected) return false; 

        const start = new Date(`${formData.date}T${formData.start_time}`);
        const end = new Date(`${formData.end_date}T${formData.end_time}`);
        return end > start;
    };

    const isStepTwoValid = () => {
        return formData.images.length > 0;
    };


    const nextStep = () => {
        if (step === 1 && !isStepOneValid()) return;
        setStep((prev) => Math.min(3, prev + 1));
    };

    const prevStep = () => {
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onFieldClick = (key) => {
        const stepOneFields = [
            'title', 'description', 'date', 'start_time', 'end_date', 'end_time',
            'max_participants', 'price', 'city', 'postal_code', 'street', 'street_number', 'categories'
        ];
        const stepTwoFields = ['images'];

        if (stepOneFields.includes(key)) {
            setStep(1);
        } else if (stepTwoFields.includes(key)) {
            setStep(2);
        }
    };

    const onRemoveImage = (index) => {
        if (formData.images.length <= 1) return;

        const updatedImages = formData.images.filter((_, i) => i !== index);

        setFormData((prev) => ({
            ...prev,
            images: index === 0 ? [...updatedImages] : updatedImages,
        }));
    };

    const handleSubmit = async () => {
        try {
            const start = `${formData.date}T${formData.start_time}`;
            const end = `${formData.end_date || formData.date}T${formData.end_time}`;
            const finalData = {
                ...formData,
                start_time: start,
                end_time: end,
                date_created: new Date().toISOString()
            };

            await handleCreateEvent(finalData);
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            await Swal.fire({
                icon: 'success',
                title: 'Événement créé avec succès !',
                text: 'Votre événement a été enregistré.',
                confirmButtonText: 'Super !',
                confirmButtonColor: '#2563eb'
            });

            navigate('/');
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la création de l’événement.',
                confirmButtonText: 'Fermer'
            });
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 px-6 pb-20">
                <h1 className="text-4xl font-extrabold text-center mb-12 font-sans">Création d'événement</h1>

                <Stepper currentStep={step} />

                <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
                    {step === 1 && <EventStepOne formData={formData} onChange={handleChange} setCitySelected={setCitySelected} />}
                    {step === 2 && <EventStepTwo formData={formData} onChange={handleChange} />}
                    {step === 3 && (<EventStepThree data={formData} images={formData.images} onFieldClick={onFieldClick} onRemoveImage={onRemoveImage} />)}


                    <div className="flex justify-between mt-12">
                        {step > 1 && (
                            <button onClick={prevStep} className="px-6 py-2 text-white bg-gray-400 rounded hover:bg-gray-500 transition">
                                Précédent
                            </button>
                        )}

                        {step < 3 && (
                            <div className="relative group">
                                <button
                                    onClick={nextStep}
                                    disabled={step === 1 ? !isStepOneValid() : step === 2 ? !isStepTwoValid() : false}
                                    className={`px-6 py-2 rounded text-white transition duration-300 ${!isStepOneValid()
                                        ? 'bg-[#E8B9E0] cursor-not-allowed'
                                        : 'bg-[#D232BE] hover:bg-blue-700'
                                        }`}
                                >
                                    Suivant
                                </button>
                                {((step === 1 && !isStepOneValid()) || (step === 2 && !isStepTwoValid())) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border border-gray-300 shadow-md rounded px-4 py-2 text-sm text-gray-700 w-80 hidden group-hover:block z-10"
                                    >
                                        {step === 1
                                            ? "Tous les champs requis doivent être remplis, avec une date de fin supérieure."
                                            : "Une image est nécessaire pour passer à l’étape suivante."}
                                    </motion.div>
                                )}

                            </div>
                        )}

                        {step === 3 && (
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
                                Créer l’événement
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

export default CreateEventPage;