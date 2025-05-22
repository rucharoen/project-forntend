import React, { useEffect, useState } from "react";
import PromotionCard from "./PromotionCard";
import { Spinner } from "react-bootstrap";
import AccommodationService from "../../services/api/accommodation/accommodation.service";

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

      const promotionData = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.promotions)
        ? res.data.promotions
        : [];

      setPromotions(promotionData);
    } catch (error) {
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row" style={{ minHeight: "276px" }}>
      {loading ? (
        <div className="text-center my-5 w-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : promotions.length > 0 ? (
        promotions.slice(0, 3).map((promotion) => (
          <PromotionCard key={promotion.id} accommodation={promotion} />
        ))
      ) : (
        <div className="text-center w-100">
          <p className="text-danger mb-0">ไม่สามารถโหลดข้อมูลได้</p>
        </div>
      )}
    </div>
  );
};

export default Promotion;
