import { useEffect, useState } from "react";
import AccommodationService from "../../services/api/accommodation/accommodation.service";
import PromotionCard from "./PromotionCard";
import { Spinner } from "react-bootstrap";

// ✅ เพิ่มบรรทัดนี้
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Popular = () => {
  const [populars, setPopulars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularAccommodations();
  }, []);

  const fetchPopularAccommodations = async () => {
    try {
      setLoading(true);
      const res = await AccommodationService.getPopularAccommodation();
      setPopulars(res?.data || []);
    } catch (error) {
      console.error("Error fetching popular accommodations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : populars.length > 0 ? (
        populars.map((acc) => (
          <PromotionCard key={acc.id} accommodation={acc} />
        ))
      ) : (
        <div className="text-center col-12 my-5">
          <p className="text-danger">ไม่สามารถโหลดข้อมูลห้องพัก</p>
        </div>
      )}
    </div>
  );
};

export default Popular;
