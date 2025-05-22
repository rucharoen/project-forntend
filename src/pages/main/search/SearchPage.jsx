import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Badge
} from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/th";
import formatPrice from "../../../utils/FormatPrice";
import SearchBox from "../../../components/search/SearchBox";
import AccommodationService from "../../../services/api/accommodation/accommodation.service";
import TypeService from "../../../services/api/accommodation/type.service";
import GetRoomAvailability from "../../../components/common/GetRoomAvailability";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalResults, setOriginalResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [filters, setFilters] = useState({
    priceRange: [0, 10000], breakfast: false,
    freeCancel: false, highRating: false,
    selectedTypes: []
  });

  const destination = searchParams.get("destination") || "";
  const checkInDate = searchParams.get("checkIn") || dayjs().add(1, "day").format("YYYY-MM-DD");
  const checkOutDate = searchParams.get("checkOut") || dayjs().add(2, "day").format("YYYY-MM-DD");
  const guests = searchParams.get("guests") || 1;

  const groupByType = (accommodations) => accommodations.reduce((groups, acc) => {
    const typeName = acc.type?.name || "Other";
    if (!groups[typeName]) groups[typeName] = [];
    groups[typeName].push(acc);
    return groups;
  }, {});

  useEffect(() => { (async () => {
    try {
      const response = await TypeService.getAll();
      if (response?.data) setTypes(response.data);
    } catch (error) { console.error("Error fetching accommodation types:", error); }
  })(); }, []);

  useEffect(() => {
    document.title = `ผลการค้นหา - ${destination || "ทุกประเภทห้องพัก"} | บาราลี รีสอร์ท เกาะช้าง`;
    (async () => {
      setLoading(true);
      try {
        const res = destination
          ? await AccommodationService.getSearch(destination, checkInDate, checkOutDate, guests)
          : await AccommodationService.getAll();
        const results = res?.data || [];
        setOriginalResults(results);
        setFilteredResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, destination, checkInDate, checkOutDate, guests]);

  useEffect(() => {
    const applyAllFilters = () => {
      const { priceRange, breakfast, freeCancel, highRating, selectedTypes } = filters;
      const filtered = originalResults.filter((acc) => {
        const price = acc.price_per_night || 0;
        return (
          price >= priceRange[0] && price <= priceRange[1] &&
          (!breakfast || acc.breakfastIncluded) &&
          (!freeCancel || acc.freeCancellation) &&
          (!highRating || acc.rating >= 8) &&
          (selectedTypes.length === 0 || selectedTypes.includes(acc.type?.name))
        );
      });
      setFilteredResults(filtered);
    };
    applyAllFilters();
  }, [filters, originalResults]);

  useEffect(() => {
    (async () => {
      if (checkInDate && checkOutDate) {
        const result = await GetRoomAvailability(checkInDate, checkOutDate);
        setAvailabilityData(result);
      }
    })();
  }, [checkInDate, checkOutDate]);

  const resetFilters = () => {
    setFilters({ priceRange: [0, 10000], breakfast: false, freeCancel: false, highRating: false, selectedTypes: [] });
    setFilteredResults(originalResults);
  };

  const handleTypeChange = (typeName) => {
    const newSelectedTypes = filters.selectedTypes.includes(typeName)
      ? filters.selectedTypes.filter((t) => t !== typeName)
      : [...filters.selectedTypes, typeName];
    setFilters((prev) => ({ ...prev, selectedTypes: newSelectedTypes }));
  };

  const matchesSearchTerm = (acc) => {
    if (!destination) return true;
    const term = destination.toLowerCase();
    return [acc.name, acc.city, acc.province, acc.type?.name].some((field) => field?.toLowerCase().includes(term));
  };

  const visibleResults = filteredResults.filter(matchesSearchTerm);
  const groupedVisibleResults = groupByType(visibleResults);

  const getDiscountedPrice = (accommodation) => {
    const { price_per_night: originalPrice, discount } = accommodation;
    return typeof discount === "number" && discount > 0
      ? Math.round(originalPrice * (1 - discount / 100))
      : originalPrice;
  };

  const DiscountedPrice = ({ accommodation }) => {
    const originalPrice = accommodation.price_per_night;
    const discount = accommodation.discount;
    const discounted = getDiscountedPrice(accommodation);

    return (
      <div className="d-flex align-items-baseline mb-2">
        {discount > 0 && (
          <>
            <span className="text-decoration-line-through text-secondary me-2">
              {originalPrice.toLocaleString()}
            </span>
            <span className="text-danger fw-bold me-3">ประหยัด {discount}%</span>
          </>
        )}
        <span className={`h5 fw-bold ${discount > 0 ? "text-danger" : "text-success"}`}>
          {discounted.toLocaleString()} บาท
        </span>
      </div>
    );
  };

  return (
  <Container className="my-4">
    <Row className="gx-4">
      {/* ซ้าย: ข้อมูลห้องพัก + รูป */}
      <Col md={4}>
        <Card className="p-3 text-center" style={{ background: "rgba(207, 244, 255, 1)", borderRadius: 12 }}>
          <h5 className="fw-bold mb-3">พรีเมียรืดีลักซ์ วิลล่า</h5>

          <img
            src="https://picsum.photos/id/1011/600/400"
            className="img-fluid rounded mb-2"
            style={{ maxHeight: 240, objectFit: "cover" }}
            alt="ห้องหลัก"
          />

          <Row className="g-2">
            {[102, 103].map((id) => (
              <Col xs={6} key={id}>
                <img
                  src={`https://picsum.photos/id/${id}/300/200`}
                  className="img-fluid rounded"
                  alt={`รูป ${id}`}
                />
              </Col>
            ))}
          </Row>

          <div className="mt-3 text-muted" style={{ fontSize: "0.9em" }}>
            <i className="bi bi-arrows-fullscreen me-2"></i>47 ตร.ม.
            <br />
            <i className="bi bi-person-fill me-2"></i> เตียงแฝด หรือ เตียงใหญ่
          </div>

          <div className="mt-2">
            <a href="#" style={{ color: "orange", textDecoration: "underline" }}>
              คลิกดูรายละเอียดห้องและรูปเพิ่มเติม
            </a>
          </div>
        </Card>
      </Col>

      {/* ขวา: รายการตัวเลือกห้องพัก + ราคาหลากหลาย */}
      <Col md={8}>
        <div
          className="text-center text-dark py-2 rounded mb-3 fw-bold"
          style={{ fontSize: "1.1em", background: "rgba(207, 244, 255, 1)" }}
        >
          รายละเอียดห้องพัก
        </div>

        {[1, 2].map((option, idx) => (
          <Card key={idx} className="mb-3 p-3">
            <Row>
              {/* สิ่งอำนวยความสะดวก */}
              <Col md={7}>
                <ul className="list-unstyled mb-0" style={{ fontSize: "0.95em" }}>
                  <li><i className="bi bi-cup-hot-fill me-2"></i>รวมอาหารเช้าระดับยอดเยี่ยม</li>
                  <li><i className="bi bi-x-circle me-2"></i>ไม่สามารถรับเงินคืนได้ (ราคาถูกสุด!)</li>
                  <li><i className="bi bi-wifi me-2"></i>ฟรีอินเทอร์เน็ตไร้สาย (Wi-Fi)</li>
                  <li><i className="bi bi-car-front-fill me-2"></i>ที่จอดรถ</li>
                  <li><i className="bi bi-arrow-left-right me-2"></i>เปลี่ยนวันเข้าพักได้</li>
                  <li><i className="bi bi-cash me-2"></i>ชำระเงินออนไลน์</li>
                </ul>
              </Col>

              {/* ราคาและปุ่มจอง */}
              <Col md={5} className="text-end d-flex flex-column justify-content-between">
                {idx === 0 ? (
                  <>
                    <div>
                      <div className="text-danger fw-bold">ประหยัด 60%</div>
                      <div className="text-warning mb-2">
                        ★★★★★ <small>(95)</small>
                      </div>
                      <div className="text-decoration-line-through text-muted">9,000 บาท</div>
                      <h4 className="text-success fw-bold">3,600 THB/คืน</h4>
                      <div className="text-muted" style={{ fontSize: "0.8em" }}>รวมภาษีและค่าธรรมเนียม</div>
                    </div>
                    <Button style={{ backgroundColor: "rgba(114, 181, 77, 1)", border: "none" }} className="mt-2 rounded-pill">
                      จองเลยตอนนี้
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-warning mb-2">
                        ★★★★☆ <small>(90)</small>
                      </div>
                      <h4 className="text-dark fw-bold">9,000 THB/คืน</h4>
                      <div className="text-muted" style={{ fontSize: "0.8em" }}>รวมภาษีและค่าธรรมเนียม</div>
                    </div>
                    <Button style={{ backgroundColor: "rgba(114, 181, 77, 1)", border: "none" }} className="mt-2 rounded-pill">
                      จองเลยตอนนี้
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </Col>
    </Row>
  </Container>
);

};

export default SearchPage;
