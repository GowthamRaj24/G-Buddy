import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFile, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BACKEND_URL } from '../backendURL';

const steps = [
    { id: 1, title: 'Upload File' },
    { id: 2, title: 'Add Details' },
    { id: 3, title: 'Preview & Submit' }
];


const UploadNotes = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        sem: '',
        unit: '',
        faculty: '',
        file: null
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const [loading, setLoading] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData(prev => ({ ...prev, file }));
            setCurrentStep(2);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        console.log("Added file " + file)
        if (file && file.type === 'application/pdf') {
            setFormData(prev => ({ ...prev, file }));
            setCurrentStep(2);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Validation checks
        if (!formData.file) {
            setLoading(false);
            return toast.error('Please upload a file', {
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    
        if (!formData.title || !formData.subject || !formData.unit || !formData.description) {
            setLoading(false);
            return toast.error('Please fill all the fields', {
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    
        // Create FormData instance
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.file);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('sem', formData.sem);
        formDataToSend.append('userId', JSON.parse(localStorage.getItem('user'))._id);
        console.log("userId: " + JSON.parse(localStorage.getItem('user'))._id);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('format', formData.file.type);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('faculty', formData.faculty || '');
    
        try {
            const response = await axios.post(
                `${BACKEND_URL}/notes/addNotes`, 
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            console.log('Upload successful:', response.data);
            window.location.href = "/notes";
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "File might be too large to upload", {
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <ToastContainer />
            <div className="max-w-4xl mx-auto px-6">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        currentStep >= step.id 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {currentStep > step.id ? <FaCheck /> : step.id}
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-600">
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 ${
                                        currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Upload Area */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm p-8 ${
                            dragActive ? 'border-2 border-emerald-500' : ''
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            <FaCloudUploadAlt className="mx-auto text-6xl text-emerald-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Upload Your Notes
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Drag and drop your PDF file here, or click to browse
                            </p>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileInput}
                            />
                            <label
                                htmlFor="fileInput"
                                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                            >
                                Choose File
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* Details Form */}
                {currentStep === 2 && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        subject: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Faculty
                                </label>
                                <input
                                    type="text"
                                    value={formData.faculty}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        faculty: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        unit: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    <option value="">Select Unit</option>
                                    {[1,2,3,4,5].map(unit => (
                                        <option key={unit} value={unit}>
                                            Unit {unit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* Preview & Submit */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-8"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Review Your Upload
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <FaFile className="text-emerald-500 mr-3" />
                                <span className="font-medium">{formData.file?.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Title</p>
                                    <p className="font-medium">{formData.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Subject</p>
                                    <p className="font-medium">{formData.subject}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Faculty</p>
                                    <p className="font-medium">{formData.faculty}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unit</p>
                                    <p className="font-medium">{formData.unit}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="font-medium">{formData.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                onClick={handleSubmit}
                                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50"
                                
                            >
                                {loading ? 'Uploading...' : 'Submit'}
                            </button>
 
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UploadNotes;
