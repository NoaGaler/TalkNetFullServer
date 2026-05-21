import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';
import UniversalModal from './UniversalModal';

const PhotoGallery = () => {
    const [limit, setLimit] = useState(4);
    const [allPhotos, setAllPhotos] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', initialData: null });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const { albumId } = useParams();
    const navigate = useNavigate();
    const { mutate } = useMutation();

    const fetchUrl = albumId
        ? `http://localhost:3000/photos?albumId=${albumId}&_limit=${limit}&_t=${refreshTrigger}`
        : null;
    const { data: fetchedPhotos, loading } = useFetch(fetchUrl);

    const onBack = () => navigate(-1);

    //to convenient display
    useEffect(() => {
        if (fetchedPhotos && Array.isArray(fetchedPhotos)) {
            setAllPhotos(fetchedPhotos);
        }
    }, [fetchedPhotos]);

    useEffect(() => {
        setAllPhotos([]);
        setLimit(4);
    }, [albumId]);

    const handleSave = async (data) => {
        try {
            const payload = { ...data, albumId: String(albumId), thumbnailUrl: data.url };
            if (modalConfig.mode === 'add') {
                await mutate(`http://localhost:3000/photos`, 'POST', payload);
            } else {
                await mutate(`http://localhost:3000/photos/${modalConfig.initialData.id}`, 'PATCH', data);
            }
            setRefreshTrigger(prev => prev + 1);
            setModalConfig({ isOpen: false, mode: 'add', initialData: null });
        } catch (err) {
            alert("Action failed.");
        }
    };

    return (
        <div className="galleryContainer">
            <div className="galleryHeader">
                <button className="backBtn" onClick={onBack}>← Back</button>
                <h2 className="albumHeader">Album #{albumId}</h2>
                <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, mode: 'add', initialData: null })}>+ Add Photo</button>
            </div>

            <div className="photoGrid">
                {allPhotos.map(photo => (
                    <div key={photo.id} className="photoCard">
                        <div className="photoActions">
                            <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', initialData: photo })}>🖊️</button>
                            <button onClick={async () => {
                                if (window.confirm("Delete?")) {
                                    await mutate(`http://localhost:3000/photos/${photo.id}`, 'DELETE');
                                    setRefreshTrigger(prev => prev + 1);
                                }
                            }}>🗑️</button>
                        </div>
                        <img src={photo.url} alt={photo.title} className="albumPhoto" />
                        <p className="photoTitle">{photo.title}</p>
                    </div>
                ))}
            </div>

            <div className="paginationArea">
                {loading ? (
                    <div>Loading more photos...</div>
                ) : (
                    allPhotos.length >= limit && (
                        <button className="loadMoreBtn" onClick={() => setLimit(prev => prev + 4)}>
                            Load More
                        </button>
                    )
                )}
            </div>

            <UniversalModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSave={handleSave}
                title="Photo Modal"
                fields={[{ name: 'title', label: 'Title' }, { name: 'url', label: 'URL' }]}
                initialData={modalConfig.initialData}
            />
        </div>
    );
};

export default PhotoGallery;






