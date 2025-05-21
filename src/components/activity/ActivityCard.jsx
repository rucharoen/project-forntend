import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ActivityCard = ({ activity }) => {
    const [showModal, setShowModal] = useState(false);

    const imageUrl = `${import.meta.env.VITE_BASE_URL}/uploads/activities/${activity.image_name}`;
    const title = activity.name || "กิจกรรม";

    const handleCardClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            {/* Card Component */}
            <div className="activity-card-wrapper h-100">
                <button
                    className="activity-card d-block border-0 p-0 bg-white w-100"
                    onClick={handleCardClick}
                    style={{
                        width: "305px",
                        height: "430px",
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: "0.5rem",
                        boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    <img
    src={imageUrl}
    alt={title}
    className="img-fluid"
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        border: "1px solid rgba(145, 145, 145, 1)", // ✅ เพิ่มเส้นขอบที่ต้องการ
        borderRadius: "0.5rem" // optional ทำให้ขอบมน
    }}
    loading="lazy"
/>

                </button>
            </div>

            {/* Modal Component */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                size="lg"
                backdrop="static"
            >
                <Modal.Body className="p-0">
                    <div className="position-relative bg-white rounded shadow overflow-hidden">
                        <button
                            onClick={handleCloseModal}
                            className="btn btn-close position-absolute top-0 end-0 m-2 z-3 bg-white rounded-circle p-2"
                            aria-label="Close"
                            style={{
                                opacity: 1,
                                boxShadow: "0 0 5px rgba(0,0,0,0.3)"
                            }}
                        />
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-100 img-fluid"
                            style={{
                                objectFit: 'cover',
                                maxHeight: '60vh',
                                width: '100%'
                            }}
                        />
                        <div className="p-4">
                            <h4 className="mb-3 text-center fw-bold" style={{ color: "#333" }}>
                                {title}
                            </h4>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ActivityCard;
