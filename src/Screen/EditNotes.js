import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../Services/api';
import Banner from '../Component/banner';
import { useParams } from 'react-router-dom';

function EditNotes(){
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [sellForValue, setSellForValue] = useState('');
    const validationSchema = Yup.object().shape({
        noteTitle: Yup.string().required('Note Title is required'),
        category: Yup.string().required('Category is required'),
        notesType: Yup.string().required('Notes Type is required'),
        numberOfPages: Yup.number().required('Number of Pages is required'),
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
        displayPicture: Yup.mixed().required('Display Picture is required'),
        notesAttachment: Yup.mixed().required('Notes Attachment is required'),
        previewUpload: Yup.mixed().required('Preview Upload is required'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await api.get(`/notesById/${id}`);
                setNote(response.data); // Assuming API response returns the note object
            } catch (error) {
                console.error('Error fetching note:', error);
            }
        };
        fetchNote();
    }, [id]); 

    const onSubmit = async (data) => {
        try {
            // Get email from local storage
            const email = localStorage.getItem('email');
            // Add email to the data being sent to the API
            const requestData = { ...data, email };
    
            const response = await api.put(`/updateNotes/${note.id}`, requestData);
            console.log('Note updated successfully:', response.data);
            // Handle redirection or any other actions after successful update
        } catch (error) {
            console.error('Error updating note:', error);
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
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Note Title</label>
                                <input type="text" className="form-control" defaultValue={note.noteTitle} {...register('noteTitle')} />
                                {errors.noteTitle && <span className="text-danger">{errors.noteTitle.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Display Picture</label>
                                <input type="file" className="form-control" {...register('displayPicture')} accept="image/*" />
                                {errors.displayPicture && <span className="text-danger">{errors.displayPicture.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Notes Type</label>
                                <input type="text" className="form-control" defaultValue={note.notesType} {...register('notesType')} />
                                {errors.notesType && <span className="text-danger">{errors.notesType.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" className="form-control" defaultValue={note.category} {...register('category')} />
                                {errors.category && <span className="text-danger">{errors.category.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Notes Attachment</label>
                                <input type="file" className="form-control" {...register('notesAttachment')} accept=".pdf" />
                                {errors.notesAttachment && <span className="text-danger">{errors.notesAttachment.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Number of Pages</label>
                                <input type="number" className="form-control" defaultValue={note.numberOfPages} {...register('numberOfPages')} />
                                {errors.numberOfPages && <span className="text-danger">{errors.numberOfPages.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Notes Description</label>
                                <textarea className="form-control" defaultValue={note.notesDescription} {...register('notesDescription')} />
                                {errors.notesDescription && <span className="text-danger">{errors.notesDescription.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Institution Information</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" className="form-control" defaultValue={note.country} {...register('country')} />
                                {errors.country && <span className="text-danger">{errors.country.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>University Information</label>
                                <input type="text" className="form-control" defaultValue={note.universityInformation} {...register('universityInformation')} />
                                {errors.universityInformation && <span className="text-danger">{errors.universityInformation.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Course Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Information</label>
                                <input type="text" className="form-control" defaultValue={note.courseInformation} {...register('courseInformation')} />
                                {errors.courseInformation && <span className="text-danger">{errors.courseInformation.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Professor/Lecturer</label>
                                <input type="text" className="form-control" defaultValue={note.professorLecturer} {...register('professorLecturer')} />
                                {errors.professorLecturer && <span className="text-danger">{errors.professorLecturer.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Course Code</label>
                                <input type="text" className="form-control" defaultValue={note.courseCode} {...register('courseCode')} />
                                {errors.courseCode && <span className="text-danger">{errors.courseCode.message}</span>}
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Selling Information</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Sell For</label>
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
                                <input type="file" className="form-control" {...register('previewUpload')} accept=".pdf" />
                                {errors.previewUpload && <span className="text-danger">{errors.previewUpload.message}</span>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    );
};

export default EditNotes;
