import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../Services/api';
import Banner from '../Component/banner';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import { ToastContainer } from 'react-toastify';
import * as pdfjsLib from 'pdfjs-dist';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import { showConfirm } from '../Utility/ConfirmBox';

function EditNotes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [sellForValue, setSellForValue] = useState('');
    const [displayPictureFile, setDisplayPictureFile] = useState();
    const [previewUploadFile, setPreviewUploadFile] = useState();
    const [notesAttachmentFiles, setNotesAttachmentFiles] = useState([]);
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [noteTypes, setNoteTypes] = useState([]);
    const [initialNotesAttachmentP, setInitialNotesAttachmentP] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [NumberOfPages, setNumberOfPages] = useState('');


    const validationSchema = Yup.object().shape({
        noteTitle: Yup.string().required('Note Title is required'),
        category: Yup.string().required('Category is required'),
        notesType: Yup.string().required('Notes Type is required'),
        notesDescription: Yup.string().required('Notes Description is required'),
        universityInformation: Yup.string().required('University Information is required'),
        country: Yup.string().required('Country is required'),
        courseInformation: Yup.string().required('Course Information is required'),
        courseCode: Yup.string().required('Course Code is required'),
        professorLecturer: Yup.string().required('Professor/Lecturer is required'),
        sellFor: Yup.string().required('Sell For is required'),
        sellPrice: Yup.number().default(0),
        statusFlag: Yup.string(),
        publishFlag: Yup.string(),
        displayPictureP: Yup.mixed().nullable(), // Changed to mixed
        notesAttachmentP: Yup.array().of(Yup.mixed()).min(1, 'Please upload at least one notes attachment.'), // Array of files
        previewUploadP: Yup.mixed().nullable(), // Changed to mixed
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({  // Added trigger
        resolver: yupResolver(validationSchema),
        defaultValues: {
            notesAttachmentP: [], // Initialize as empty array
        }
    });

    const watchNotesAttachmentP = watch('notesAttachmentP');

    const fetchNoteAndLookupData = async (noteId) => { // Made it async
        try {
            const noteResponse = await api.get(`/notesById/${noteId}`);
            const fetchedNote = noteResponse.data;
            setNote(fetchedNote);
            console.log(fetchedNote);

            const lookupResponse = await api.get('/getAllLookup');
            const filteredCountries = lookupResponse.data.filter(item => item.typeCode === "CON");
            const filteredCategories = lookupResponse.data.filter(item => item.typeCode === "CAT");
            const filteredNoteTypes = lookupResponse.data.filter(item => item.typeCode === "TYP");

            setCountries(filteredCountries);
            setCategories(filteredCategories);
            setNoteTypes(filteredNoteTypes);
            // Set initial form values.  Use setValue.
            setValue('noteTitle', fetchedNote.noteTitle);
            setValue('category', fetchedNote.category);
            setValue('notesType', fetchedNote.notesType);
            setValue('notesDescription', fetchedNote.notesDescription);
            setValue('universityInformation', fetchedNote.universityInformation);
            setValue('country', fetchedNote.country);
            setValue('courseInformation', fetchedNote.courseInformation);
            setValue('courseCode', fetchedNote.courseCode);
            setValue('professorLecturer', fetchedNote.professorLecturer);
            setValue('sellFor', fetchedNote.sellFor);
            setValue('sellPrice', fetchedNote.sellPrice);
            setValue('numberOfPages', fetchedNote.numberOfPages);
            setValue('displayPictureP', fetchedNote.displayPictureP);
            setValue('previewUploadP', fetchedNote.previewUploadP);


            if (fetchedNote.notesAttachmentP) {
                try {
                    const files = fetchedNote.notesAttachmentP.split(',').map(async (url) => {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const filename = url.substring(url.lastIndexOf('/') + 1);
                        return new File([blob], filename); // Create File object
                    });
                    const resolvedFiles = await Promise.all(files);
                    setInitialNotesAttachmentP(resolvedFiles); // Store initial file objects
                    setValue('notesAttachmentP', resolvedFiles);  //set form value
                } catch (err) {
                    console.log("Error", err);
                }
            }
            setNumberOfPages(fetchedNote.numberOfPages)
            setSellForValue(fetchedNote.sellFor);
            setDisplayPictureFile(fetchedNote.displayPictureP);
            setPreviewUploadFile(fetchedNote.previewUploadP);
            setNotesAttachmentFiles(fetchedNote.notesAttachmentP);

        } catch (error) {
            console.error('Error fetching data:', error);
            showErrorToast('Failed to load note data.');
        }
    };

    useEffect(() => {
        fetchNoteAndLookupData(id);
    }, [id, setValue]);


    useEffect(() => {
        console.log('watchNotesAttachmentP updated:', watchNotesAttachmentP);
        if (watchNotesAttachmentP && watchNotesAttachmentP.length > 0) {
            const processFiles = async (files) => {
                let calculatedPages = NumberOfPages;
                for (const file of files) {
                    if (file && file.type === 'application/pdf') {
                        try {
                            const fileReader = new FileReader();
                            await new Promise((resolve, reject) => {
                                fileReader.onload = async () => {
                                    const typedArray = new Uint8Array(fileReader.result);
                                    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
                                    try {
                                        const pdf = await pdfjsLib.getDocument(typedArray).promise;
                                        calculatedPages += pdf.numPages;
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
                return calculatedPages;
            }

            processFiles(watchNotesAttachmentP).then((calculatedPages) => {
                setTotalPages(calculatedPages); // Update state
                setValue('numberOfPages', calculatedPages);
            })

        } else {
            setTotalPages(0);
            setValue('numberOfPages', 0);
        }
    }, [watchNotesAttachmentP, setValue]);


    const onSubmit = async (data) => {
        try {
            const userEmail = getUserEmail();
            const formData = new FormData();
            data.publishFlag = 'N';
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


            if (data.displayPictureP && data.displayPictureP[0] instanceof File) {
                formData.append('displayPictureP', data.displayPictureP[0]);
            } else if (typeof displayPictureFile === 'string') {
                formData.append('displayPictureP', displayPictureFile); // retain existing path
            }
            
            // For Preview Upload
            if (data.previewUploadP && data.previewUploadP[0] instanceof File) {
                formData.append('previewUploadP', data.previewUploadP[0]);
            } else if (typeof previewUploadFile === 'string') {
                formData.append('previewUploadP', previewUploadFile); // retain existing path
            }

            if (data.notesAttachmentP && data.notesAttachmentP.length > 0) {
                data.notesAttachmentP.forEach((file) => {
                    formData.append('notesAttachmentP', file);
                });
            }

            console.log('Form Data:', [...formData.entries()]);

            // Send formData to the API endpoint for updating the note
            const response = await api.put(`/updateNotes/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            console.log('Note updated successfully:', response.data);
            showSuccessToast('Notes updated successfully');
            setTimeout(() => {
                navigate(`/sellNotes`);
            }, 2000);
        } catch (error) {
            console.error('Error updating note:', error);
            showErrorToast('Failed to save notes. Please try again.');
        }
    };

    const handleDisplayPictureChange = (event) => {
        const file = event.target.files[0];
        setDisplayPictureFile(file);  //store the file
        setValue('displayPictureP', event.target.files); //set to form
        trigger('displayPictureP');
        console.log(file);
    };

    const handlePreviewUploadChange = (event) => {
        const file = event.target.files[0];
        setPreviewUploadFile(file);  //store the file
        setValue('previewUploadP', event.target.files);  //set to form
        trigger('previewUploadP');
        console.log(file);
    };

    const handleNotesAttachmentChange = (event) => {
        const files = Array.from(event.target.files);
        setValue('notesAttachmentP', [...watch('notesAttachmentP'), ...files]); // Corrected
        trigger('notesAttachmentP');
    };

    const removeAttachedFile = (index) => {
        const currentFiles = watch('notesAttachmentP');
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        setValue('notesAttachmentP', updatedFiles);
        trigger('notesAttachmentP');
    };


    const handleSave = () => {
        handleSubmit((data) => {
            data.statusFlag = 'S'; // Set the status flag directly in the form data
            onSubmit(data);         // Pass the updated data to onSubmit
        })();
    };

    const handlePublish = async () => {
        const confirmed = await showConfirm("Publishing this note will send the note to the administrator for review. Once reviewed and approved, it will be published to the portal. Press Yes to continue.");
        if (confirmed) {
            handleSubmit((data) => {
                data.statusFlag = 'P'; // Set the status flag for publish
                onSubmit(data);         // Pass the updated data to onSubmit
            })();
        }
    };

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Banner text="Edit Note" imageHeight="250px" />

            <div className="container d-flex justify-content-center">
                <form onSubmit={handleSubmit(onSubmit)} className="col-md-8">
                    <h1 style={{ color: '#734dc4', paddingTop: '15px', fontSize: '24px' }}>Basic Notes Details</h1>
                    <input type="hidden" defaultValue={note.id} {...register('noteId')} />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Note Title<span className="required">*</span></label>
                                <input type="text" className="form-control" defaultValue={note.noteTitle} {...register('noteTitle')} />
                                {errors.noteTitle && <span className="text-danger">{errors.noteTitle.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Display Picture</label>
                                <input type="file" className="form-control" onChange={handleDisplayPictureChange} accept="image/*" />
                                {errors.displayPictureP && <span className="text-danger">{errors.displayPictureP.message}</span>}
                                {displayPictureFile && (
                                    <div className="mt-2">
                                        <div style={{ gap: '2px' }}>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                style={{ fontSize: '0.75rem', padding: '2px 8px', lineHeight: '1.2', width: 'fit-content', maxWidth: '100%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '4px', }}
                                                title="Click to remove"
                                            >
                                                {typeof displayPictureFile === 'string' ? displayPictureFile.substring(displayPictureFile.lastIndexOf('/') + 1) : displayPictureFile.name}
                                            </button>

                                        </div>
                                    </div>
                                )}
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
                                                    style={{ fontSize: '0.75rem', padding: '2px 8px', lineHeight: '1.2', width: 'fit-content', maxWidth: '100%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '4px', }}
                                                    title="Click to remove"
                                                    onClick={() => removeAttachedFile(index)}
                                                >
                                                    {file.name} x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {initialNotesAttachmentP && initialNotesAttachmentP.length > 0 && (
                                    <div className="mt-2">
                                        <strong className="d-block mb-2" style={{ fontSize: '0.8rem' }}>Attached Files:</strong>
                                        <div style={{ gap: '2px' }}>
                                            {initialNotesAttachmentP.map((file, index) => (
                                                <button
                                                    key={`initial-${index}`}
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    style={{ fontSize: '0.75rem', padding: '2px 8px', lineHeight: '1.2', width: 'fit-content', maxWidth: '100%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '4px', }}
                                                    title={file.name}

                                                >
                                                    {file.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Number of Pages<span className="required">*</span></label>
                                <input type="number" className="form-control" value={totalPages} {...register('numberOfPages')} disabled />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Notes Description<span className="required">*</span></label>
                                <textarea className="form-control" defaultValue={note.notesDescription} {...register('notesDescription')} />
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
                                <input type="text" className="form-control" defaultValue={note.universityInformation} {...register('universityInformation')} />
                                {errors.universityInformation && <span className="text-danger">{errors.universityInformation.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Course Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Information<span className="required">*</span></label>
                                <input type="text" className="form-control" defaultValue={note.courseInformation} {...register('courseInformation')} />
                                {errors.courseInformation && <span className="text-danger">{errors.courseInformation.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Professor/Lecturer<span className="required">*</span></label>
                                <input type="text" className="form-control" defaultValue={note.professorLecturer} {...register('professorLecturer')} />
                                {errors.professorLecturer && <span className="text-danger">{errors.professorLecturer.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Code<span className="required">*</span></label>
                                <input type="text" className="form-control" defaultValue={note.courseCode} {...register('courseCode')} />
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
                                        <input type="radio" value="paid" {...register('sellFor')} defaultChecked={note.sellFor === 'paid'} onChange={(e) => setSellForValue(e.target.value)} /> Paid
                                    </label>
                                    <label>
                                        <input type="radio" value="free" {...register('sellFor')} defaultChecked={note.sellFor === 'free'} onChange={(e) => setSellForValue(e.target.value)} /> Free
                                    </label>
                                </div>
                                {errors.sellFor && <span className="text-danger">{errors.sellFor.message}</span>}
                            </div>
                            {sellForValue === 'paid' && (
                                <div className="form-group">
                                    <label>Sell Price</label>
                                    <input type="number" className="form-control" defaultValue={note.sellPrice} {...register('sellPrice')} />
                                    {errors.sellPrice && <span className="text-danger">{errors.sellPrice.message}</span>}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Preview Upload</label>
                                <input type="file" className="form-control" onChange={handlePreviewUploadChange} accept=".pdf" />
                                {errors.previewUploadP && <span className="text-danger">{errors.previewUploadP.message}</span>}
                                {previewUploadFile && (
                                    <div className="mt-2">
                                    <div style={{ gap: '2px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            style={{ fontSize: '0.75rem', padding: '2px 8px', lineHeight: '1.2', width: 'fit-content', maxWidth: '100%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '4px', }}
                                            title="Click to remove"
                                        >
                                            {typeof previewUploadFile === 'string' ? previewUploadFile.substring(previewUploadFile.lastIndexOf('/') + 1) : previewUploadFile.name}
                                        </button>

                                    </div>
                                </div>
                                )}
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
}

export default EditNotes;
