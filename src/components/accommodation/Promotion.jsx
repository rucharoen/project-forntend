import React, { useEffect, useState } from "react";
import AccommodationService from "../../services/api/accommodation/accommodation.service";
import AccommodationCard from "./AccommodationCard";
import { Spinner } from "react-bootstrap";

const Promotion = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const res = await AccommodationService.getPromotion();
            console.log("API Response:", res?.data); // ตรวจสอบโครงสร้าง

            // ตรวจสอบว่า res.data เป็น array จริงหรือไม่
            const promotionData = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.data?.promotions)
                ? res.data.promotions
                : [];

            setPromotions(promotionData);
        } catch (error) {
            console.error("Error fetching promotions:", error);
            setPromotions([]); // fallback
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    {promotions.length > 0 ? (
                        promotions.map((promotion) => (
                            <AccommodationCard
                                key={promotion.id}
                                accommodation={promotion}
                            />
                        ))
                    ) : (
                        <div className="text-center col-12">
                            <p className="text-danger">
                                ไม่สามารถโหลดข้อมูลโปรโมชั่นได้
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Promotion;
