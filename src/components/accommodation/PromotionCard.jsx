import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PromotionCard = ({ accommodation }) => {
  const fullImageUrl = `${BASE_URL}/uploads/accommodations/${accommodation.image_name}`;
  const originalPrice = accommodation.price_per_night;
  const discountPercent = accommodation.discount;

  const hasDiscount = originalPrice && discountPercent;
  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

    

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
      <div
        className="card h-100 border-0"
        style={{
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "410px",
        }}
      >
        {/* Badge */}
        <div
          className="position-absolute bg-danger text-white px-2 py-1"
          style={{
            borderTopLeftRadius: "0.4rem",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          โปรโมชั่น
        </div>

        {/* Image */}
        <img
          src={fullImageUrl}
          alt={accommodation.name}
          className="card-img-top"
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        />

        {/* Content */}
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold mb-2" style={{ fontSize: "1.25rem" }}>
            {accommodation.name}
          </h6>
          <p className="text-warning mb-1" style={{ fontSize: "1.05rem", fontWeight: "500" }}>
            {accommodation.promotion_detail || "โปรโมชั่นพิเศษ"}
          </p>
          <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
            {accommodation.promotion_date || "1 เม.ย. - 31 ส.ค. 2568"}
          </p>
          <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
            รวมอาหารเช้า
          </p>
        </div>

        {/* Footer */}
        <div className="d-flex">
          <div
            className="fw-bold text-center"
            style={{
              backgroundColor: "white",
              color: "rgba(91, 155, 43, 1)",
              border: "1px solid rgba(91, 155, 43, 1)",
              width: "50%",
              padding: "0.375rem 0.75rem",
              borderRadius: "0 0 0 0.375rem",
              fontSize: "1rem",
              whiteSpace: "nowrap",
            }}
          >
            {hasDiscount ? `ประหยัด ${discountPercent}%` : "ราคาปกติ"}
          </div>
          <Button
            variant="primary"
            className="fw-bold"
            style={{
              backgroundColor: "rgba(0, 196, 255, 1)",
              borderColor: "rgba(0, 196, 255, 1)",
              width: "50%",
              borderRadius: "0 0 0.375rem 0",
              fontSize: "1.05rem",
              whiteSpace: "nowrap",
            }}
          >
            จองเลยตอนนี้
          </Button>
        </div>
      </div>
    </Col>
  );
};

export default PromotionCard;
