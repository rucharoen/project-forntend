import React, { useEffect, useState } from "react";
import AccommodationService from "../../services/api/accommodation/accommodation.service";
import AccommodationCard from "./AccommodationCard";
import { Spinner } from "react-bootstrap";

const Accommodation = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
    try {
        setLoading(true);

        const res = await AccommodationService.getAll();

        // log ทุกระดับของข้อมูล
        console.log("📦 res =", res);
        console.log("📦 res.data =", res?.data);
        console.log("📦 res.data.accommodations =", res?.data?.accommodations);

        let dataArray = [];

        // เช็คแบบ step-by-step
        if (Array.isArray(res)) {
            dataArray = res;
        } else if (Array.isArray(res?.data)) {
            dataArray = res.data;
        } else if (Array.isArray(res?.data?.accommodations)) {
            dataArray = res.data.accommodations;
        } else {
            console.warn("⚠️ ไม่พบ array ที่ต้องการในผลลัพธ์ API");
        }

        setAccommodations(dataArray);
    } catch (error) {
        console.error("❌ Error fetching accommodations:", error);
        setAccommodations([]); // fallback
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
                    {Array.isArray(accommodations) && accommodations.length > 0 ? (
                        accommodations.map((acc) => (
                            <AccommodationCard
                                key={acc.id}
                                accommodation={acc}
                            />
                        ))
                    ) : (
                        <div className="text-center col-12">
                            <p className="text-danger">
                                ไม่สามารถโหลดข้อมูลห้องพักได้
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Accommodation;
