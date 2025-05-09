import { React, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../Services/api';
import Banner from '../Component/banner';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getUserEmail } from '../Services/auth';
import * as pdfjsLib from 'pdfjs-dist';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import { showConfirm } from '../Utility/ConfirmBox';

const AddNotes = () => {
    const navigate = useNavigate();
    const [sellForValue, setSellForValue] = useState('');
    const [displayPictureP, setDisplayPictureP] = useState(null);
    const [previewUploadP, setPreviewUploadP] = useState(null);
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [noteTypes, setNoteTypes] = useState([]);
    const [totalPages, setTotalPages] = useState(0);


    const validationSchema = Yup.object().shape({
        noteTitle: Yup.string().required('Note Title is required'),
        category: Yup.string().required('Category is required'),
        notesType: Yup.string().required('Notes Type is required'),
        numberOfPages: Yup.number().min(0, 'Number of pages cannot be negative'),
        notesDescription: Yup.string().required('Notes Description is required'),
        universityInformation: Yup.string().required('University Information is required'),
        country: Yup.string().required('Country is required'),
        courseInformation: Yup.string().required('Course Information is required'),
        courseCode: Yup.string().required('Course Code is required'),
        professorLecturer: Yup.string().required('Professor/Lecturer is required'),
        sellFor: Yup.string().required('Sell For is required'),
        sellPrice: Yup.number().when('sellFor', (sellFor, schema) => {
            if (sellFor === 'paid') {
                return schema.required('Sell Price is required').min(0, 'Sell Price cannot be negative');
            }
            return schema.notRequired().nullable();
        }),
        displayPictureP: Yup.mixed().nullable(),
        notesAttachmentP: Yup.array().min(1, 'Please upload at least one notes attachment.').of(
            Yup.mixed().test('fileSize', 'File size must be less than 5MB', (value) => {
                if (value) {
                    return value.size <= 5 * 1024 * 1024; // 5MB
                }
                return true;
            }).test('fileType', 'Only PDF files are allowed', (value) => {
                if (value) {
                    return value.type === 'application/pdf';
                }
                return true;
            })
        ),
        previewUploadP: Yup.mixed().nullable(),
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({  // Removed reset
        resolver: yupResolver(validationSchema),
        defaultValues: {
            notesAttachmentP: [],
        },
    });

    const watchNotesAttachmentP = watch('notesAttachmentP');

    useEffect(() => {
        console.log('watchNotesAttachmentP updated:', watchNotesAttachmentP);
        let pages = 0;
        if (watchNotesAttachmentP && watchNotesAttachmentP.length > 0) {
            const processFiles = async () => {
                for (const file of watchNotesAttachmentP) {
                    if (file && file.type === 'application/pdf') {
                        try {
                            const fileReader = new FileReader();
                            await new Promise((resolve, reject) => {
                                fileReader.onload = async () => {
                                    const typedArray = new Uint8Array(fileReader.result);
                                    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
                                    try {
                                        const pdf = await pdfjsLib.getDocument(typedArray).promise;
                                        pages += pdf.numPages;
                                    } catch (error) {
                                        console.error('Error loading PDF:', error);
                                        showErrorToast(`Error loading ${file.name}. Please try again.`);
                                    }
                                    resolve();
                                };
                                fileReader.onerror = (error) => {
                                    console.error('Error reading file:', error);
                                    showErrorToast(`Error reading ${file.name}. Please try again.`);
                                    reject(error);
                                };
                                fileReader.readAsArrayBuffer(file);
                            });
                        } catch (error) {
                            console.error('Error processing PDF:', error);
                        }
                    }
                }
                setTotalPages(pages); // Update state here
                setValue('numberOfPages', pages);
            };

            processFiles();
        } else {
            setTotalPages(0);
            setValue('numberOfPages', 0);
        }
    }, [watchNotesAttachmentP, setValue]);

    const onSubmit = async (data) => {
        try {
            const userEmail = getUserEmail();
            data.publishFlag = 'N';
            const formData = new FormData();
            formData.append('email', userEmail);
            formData.append('noteTitle', data.noteTitle);
            formData.append('category', data.category);
            formData.append('notesType', data.notesType);
            formData.append('numberOfPages', data.numberOfPages);
            formData.append('notesDescription', data.notesDescription);
            formData.append('universityInformation', data.universityInformation);
            formData.append('country', data.country);
            formData.append('courseInformation', data.courseInformation);
            formData.append('courseCode', data.courseCode);
            formData.append('professorLecturer', data.professorLecturer);
            formData.append('sellFor', data.sellFor);
            formData.append('sellPrice', data.sellPrice);
            formData.append('statusFlag', data.statusFlag);
            formData.append('publishFlag', data.publishFlag);
            if (data.previewUploadP && data.previewUploadP[0]) { formData.append('previewUploadP', data.previewUploadP[0]); }
            if (data.displayPictureP && data.displayPictureP[0]) { formData.append('displayPictureP', data.displayPictureP[0]); }
            data.notesAttachmentP.forEach((file) => { formData.append('notesAttachmentP', file); });
            console.log('Form Data:', [...formData.entries()]);

            const response = await api.post('/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Note added successfully:', response.data);
            showSuccessToast('Notes added successfully');
            setTimeout(() => {
                navigate('/sellNotes');
            }, 2000);
        } catch (error) {
            console.error('Error adding note:', error);
            showErrorToast('Failed to save notes. Please try again.');
        }
    };

    const handleDisplayPictureChange = (event) => {
        const file = event.target.files[0];
        setDisplayPictureP(file);
        setValue('displayPictureP', event.target.files);
        trigger('displayPictureP');
    };

    const handlePreviewUploadChange = (event) => {
        const file = event.target.files[0];
        setPreviewUploadP(file);
        setValue('previewUploadP', event.target.files);
        trigger('previewUploadP');
    };

    const handleNotesAttachmentChange = (event) => {
        const files = Array.from(event.target.files);
        setValue('notesAttachmentP', [...watch('notesAttachmentP'), ...files]); // Corrected
        trigger('notesAttachmentP');
    };

    const removeAttachedFile = (index) => {
        setValue('notesAttachmentP', watch('notesAttachmentP').filter((_, i) => i !== index)); // Corrected
    };

    const handleSellForChange = (event) => {
        setSellForValue(event.target.value);
    };

    const handleSave = () => {
        handleSubmit((data) => {
            data.statusFlag = 'S';
            onSubmit(data);
        })();
    };

    const handlePublish = async () => {
        const confirmed = await showConfirm("Publishing this note will send the note to the administrator for review. Once reviewed and approved, it will be published to the portal. Press Yes to continue.");
        if (confirmed) {
            handleSubmit((data) => {
                data.statusFlag = 'P';
                onSubmit(data);
            })();
        }
    };

    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const response = await api.get('/getAllLookup');
                const filteredCountries = response.data.filter(item => item.typeCode === "CON");
                const filteredCategories = response.data.filter(item => item.typeCode === "CAT");
                const filteredNoteTypes = response.data.filter(item => item.typeCode === "TYP");

                setCountries(filteredCountries);
                setCategories(filteredCategories);
                setNoteTypes(filteredNoteTypes);
            } catch (error) {
                console.error('Error fetching lookup data:', error);
            }
        };

        fetchLookupData();
    }, []);

    return (
        <div>
            <Banner text="Add Notes" imageHeight="250px" />

            <div className="container d-flex justify-content-center">
                <form onSubmit={handleSubmit(onSubmit)} className="col-md-8">
                    <h1 style={{ color: '#734dc4', paddingTop: '15px', fontSize: '24px' }}>Basic Notes Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Note Title<span className="required">*</span></label>
                                <input type="text" className="form-control" {...register('noteTitle')} maxLength="100" />
                                {errors.noteTitle && <span className="text-danger">{errors.noteTitle.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Display Picture</label>
                                <input type="file" className="form-control" onChange={handleDisplayPictureChange} accept="image/*" {...register('displayPictureP')} />
                                {errors.displayPictureP && <span className="text-danger">{errors.displayPictureP?.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Notes Type<span className="required">*</span></label>
                                <select className="form-control" {...register('notesType')}>
                                    <option value="">Select Notes Type</option>
                                    {noteTypes.map((noteType) => (
                                        <option key={noteType.TypeId} value={noteType.TypeId}>
                                            {noteType.typeName}
                                        </option>
                                    ))}
                                </select>
                                {errors.notesType && <span className="text-danger">{errors.notesType.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Category<span className="required">*</span></label>
                                <select className="form-control" {...register('category')}>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.TypeId} value={category.TypeId}>
                                            {category.typeName}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <span className="text-danger">{errors.category.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Notes Attachment<span className="required">*</span></label>
                                <input type="file" className="form-control" onChange={handleNotesAttachmentChange} accept=".pdf" multiple />
                                {errors.notesAttachmentP && <span className="text-danger">{errors.notesAttachmentP.message}</span>}
                                {watchNotesAttachmentP && watchNotesAttachmentP.length > 0 && (
                                    <div className="mt-2">
                                        <strong className="d-block mb-2" style={{ fontSize: '0.8rem' }}>Attached Files:</strong>
                                        <div style={{ gap: '2px' }}>
                                            {watchNotesAttachmentP.map((file, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    style={{ fontSize: '0.75rem', padding: '2px 8px',lineHeight: '1.2',width: 'fit-content', maxWidth: '100%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '4px',}}
                                                    title="Click to remove"
                                                    onClick={() => removeAttachedFile(index)}
                                                >
                                                    {file.name} x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="form-group">
                                <label>Number of Pages<span className="required">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    {...register('numberOfPages')}
                                    value={totalPages} // Use the totalPages state here
                                    disabled
                                />
                                {errors.numberOfPages && <span className="text-danger">{errors.numberOfPages.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Notes Description<span className="required">*</span></label>
                                <textarea className="form-control" {...register('notesDescription')} />
                                {errors.notesDescription && <span className="text-danger">{errors.notesDescription.message}</span>}
                            </div>
                        </div>
                    </div>

                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Institution Information</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Country<span className="required">*</span></label>
                                <select className="form-control" {...register('country')}>
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country.TypeId} value={country.TypeId}>
                                            {country.typeName}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && <span className="text-danger">{errors.country.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>University Information<span className="required">*</span></label>
                                <input type="text" className="form-control" {...register('universityInformation')} maxLength="200" />
                                {errors.universityInformation && <span className="text-danger">{errors.universityInformation.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Course Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Information<span className="required">*</span></label>
                                <input type="text" className="form-control" {...register('courseInformation')} maxLength="100" />
                                {errors.courseInformation && <span className="text-danger">{errors.courseInformation.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Professor/Lecturer<span className="required">*</span></label>
                                <input type="text" className="form-control" {...register('professorLecturer')} maxLength="100" />
                                {errors.professorLecturer && <span className="text-danger">{errors.professorLecturer.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Code<span className="required">*</span></label>
                                <input type="text" className="form-control" {...register('courseCode')} maxLength="100" />
                                {errors.courseCode && <span className="text-danger">{errors.courseCode.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Selling Information</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Sell For<span className="required">*</span></label>
                                <div>
                                    <label>
                                        <input type="radio" value="paid" {...register('sellFor')} onChange={handleSellForChange} /> Paid
                                    </label>
                                    <label>
                                        <input type="radio" value="free" {...register('sellFor')} onChange={handleSellForChange} /> Free
                                    </label>
                                </div>
                                {errors.sellFor && <span className="text-danger">{errors.sellFor.message}</span>}
                            </div>
                            {sellForValue === 'paid' && (
                                <div className="form-group">
                                    <label>Sell Price<span className="required">*</span></label>
                                    <input type="number" className="form-control" {...register('sellPrice')} />
                                    {errors.sellPrice && <span className="text-danger">{errors.sellPrice?.message}</span>}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Preview Upload</label>
                                <input type="file" className="form-control" onChange={handlePreviewUploadChange} accept=".pdf" {...register('previewUploadP')} />
                                {errors.previewUploadP && <span className="text-danger">{errors.previewUploadP?.message}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1 pt-2 text-end"> <button style={{ backgroundColor: '#734dc4', color: 'white' }} type="button" onClick={handleSave} className=" btn btn-sm">SAVE</button></div>
                        <div className="col-11 pt-2 text-start"> <button style={{ backgroundColor: '#734dc4', color: 'white' }} type="button" onClick={handlePublish} className=" btn btn-sm">Publish</button></div>
                    </div>

                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddNotes;
