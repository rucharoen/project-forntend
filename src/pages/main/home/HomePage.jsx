import { useEffect, useState } from "react";
import Popular from "../../../components/accommodation/Popular";
import Promotion from "../../../components/accommodation/Promotion";
import Activity from "../../../components/activity/Activity";
import HeroImage from "../../../components/heroImage/HeroImage";
import SearchBox from "../../../components/search/SearchBox";
import Accommodation from "../../../components/accommodation/Accommodation"
import { Button } from "react-bootstrap";
import "./HomeSearch.css";

const HomePage = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ภาพ Hero */}
      <HeroImage />

      <section className="search-box" style={{ zIndex: 2, padding: "15 0" }}>
        <SearchBox />
      </section>

      {/* รายการที่พักยอดนิยม */}
      <section className="Promotion">
        <h3 className="fw-bold pt-1 text-center">
          <span
            className="border-bottom border-3 border-primary"
            style={{ display: "inline-block" }}
          >
            โปรโมชันพิเศษ
          </span>
        </h3>

        <Promotion />
      </section>

      <section
        className="container mb-4"
        style={{ marginTop: isDesktop ? "2rem" : "2rem" }}
      >
        <h3 className="fw-bold">
          <span className="border-bottom border-3 border-primary">
            ที่พักยอดนิยม
          </span>
          
        </h3>
      <Accommodation/>
      </section>

      {/* โปรโมชัน */}

      {/* กิจกรรมแนะนำ */}
      <section className="container my-5">
        <h3 className="text-center fw-bold">
          <span className="border-bottom border-3 border-primary">
            เพลิดเพลินกับกิจกรรมชายหาดของเรา
          </span>
        </h3>
        <Activity />
      </section>
    </>
  );
};

export default HomePage;
