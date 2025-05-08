import { React, useState,useEffect  } from 'react';
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
    const [displayPictureP, setDisplayPictureP] = useState();
    const [previewUploadP, setPreviewUploadP] = useState();
    const [notesAttachmentP, setNotesAttachmentP] = useState();
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [noteTypes, setNoteTypes] = useState([]);


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
        sellPrice: Yup.number().default(0),
        displayPictureP: Yup.string(),
        notesAttachmentP: Yup.string(),
        previewUploadP: Yup.string()
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const onSubmit = async (data) => {
        try {
            const userEmail = getUserEmail();
            data.publishFlag = 'N';
            const formData = new FormData();
            // Append each field to the formData object
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
            formData.append('notesAttachmentP', notesAttachmentP);
            formData.append('previewUploadP', previewUploadP);
            formData.append('displayPictureP', displayPictureP);

            console.log(formData);
            // Send formData to the API endpoint
            const response = await api.post('/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Note added successfully:', response.data);
            showSuccessToast('Notes added successfully');
            setTimeout(() => {
                navigate(`/sellNotes`);
            }, 4000);
        } catch (error) {
            console.error('Error adding note:', error);
            showErrorToast('Failed to save notes. Please try again.');
        }
    };
    const handleDisplayPictureChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setDisplayPictureP(file);
    };
    const handlePreviewUploadChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setPreviewUploadP(file);
    };

    const handleNotesAttachmentChange = async (event) => {
        const file = event.target.files[0];
        setNotesAttachmentP(file);

        if (file) {
            try {
                const fileReader = new FileReader();
                fileReader.onload = async () => {
                    const typedArray = new Uint8Array(fileReader.result);
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    setValue('numberOfPages', pdf.numPages);
                };
                fileReader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error counting PDF pages:', error);
                showErrorToast('Error reading PDF. Please try again.');
            }
        }
    };

    const handleSellForChange = (event) => {
        setSellForValue(event.target.value);
    };

    const handleSave = () => {
        console.log("Check");
        handleSubmit((data) => {
            data.statusFlag = 'S'; 
            onSubmit(data);      
        })();

    };

    const handlePublish = async () => {
        console.log("Check");
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
                            {/* onChange={handleDisplayPictureChange} */}
                            <div className="form-group">
                                <label>Display Picture<span className="required">*</span></label>
                                <input type="file" className="form-control" onChange={handleDisplayPictureChange} accept="image/*" />
                                {errors.displayPictureP && <span className="text-danger">{errors.displayPictureP.message}</span>}
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
                                <input type="file" className="form-control" onChange={handleNotesAttachmentChange} accept=".pdf" />
                                {errors.notesAttachmentP && <span className="text-danger">{errors.notesAttachmentP.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Number of Pages<span className="required">*</span></label>
                                <input type="number" className="form-control" {...register('numberOfPages')} defaultValue={0} disabled />
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
                                    {errors.sellPrice && <span className="text-danger">{errors.sellPrice.message}</span>}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Preview Upload<span className="required">*</span></label>
                                <input type="file" className="form-control" onChange={handlePreviewUploadChange} accept=".pdf" />
                                {errors.previewUploadP && <span className="text-danger">{errors.previewUploadP.message}</span>}
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
