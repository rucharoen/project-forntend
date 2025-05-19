import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Accordion,
  Badge,
} from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/th";
import formatPrice from "../../../utils/formatPrice";
import SearchBox from "../../../components/search/SearchBox";
import AccommodationService from "../../../services/api/accommodation/accommodation.service";
import TypeService from "../../../services/api/accommodation/type.service";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FormatToBE from "../../../utils/FormatToBE";
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
    priceRange: [0, 10000],
    breakfast: false,
    freeCancel: false,
    highRating: false,
    selectedTypes: [],
  });

  const destination = searchParams.get("destination") || "";
  const checkInDate =
    searchParams.get("checkIn") || dayjs().add(1, "day").format("YYYY-MM-DD");
  const checkOutDate =
    searchParams.get("checkOut") || dayjs().add(2, "day").format("YYYY-MM-DD");
  const guests = searchParams.get("guests") || 1;

  // Group accommodations by type
  const groupByType = (accommodations) => {
    return accommodations.reduce((groups, acc) => {
      const typeName = acc.type?.name || "Other";
      if (!groups[typeName]) {
        groups[typeName] = [];
      }
      groups[typeName].push(acc);
      return groups;
    }, {});
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await TypeService.getAll();
        if (response?.data) {
          setTypes(response.data);
        }
      } catch (error) {
        console.error("Error fetching accommodation types:", error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    document.title = `ผลการค้นหา - ${
      destination || "ทุกประเภทห้องพัก"
    } | บาราลี รีสอร์ท เกาะช้าง`;
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = destination
          ? await AccommodationService.getSearch(
              destination,
              checkInDate,
              checkOutDate,
              guests
            )
          : await AccommodationService.getAll();
        const results = res?.data || [];
        setOriginalResults(results);
        setFilteredResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchParams, destination, checkInDate, checkOutDate, guests]);

  useEffect(() => {
    const applyAllFilters = () => {
      const { priceRange, breakfast, freeCancel, highRating, selectedTypes } =
        filters;

      const filtered = originalResults.filter((acc) => {
        const price = acc.price_per_night || 0;
        const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
        const matchBreakfast = !breakfast || acc.breakfastIncluded;
        const matchFreeCancel = !freeCancel || acc.freeCancellation;
        const matchHighRating = !highRating || (acc.rating && acc.rating >= 8);
        const matchType =
          selectedTypes.length === 0 || selectedTypes.includes(acc.type?.name);
        return (
          inPriceRange &&
          matchBreakfast &&
          matchFreeCancel &&
          matchHighRating &&
          matchType
        );
      });

      setFilteredResults(filtered);
    };

    applyAllFilters();
  }, [filters, originalResults]);

  // Fetch availability data when checkInDate or checkOutDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (checkInDate && checkOutDate) {
        const result = await GetRoomAvailability(checkInDate, checkOutDate);
        setAvailabilityData(result);
      }
    };

    fetchData();
  }, [checkInDate, checkOutDate]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      breakfast: false,
      freeCancel: false,
      highRating: false,
      selectedTypes: [],
    });
    setFilteredResults(originalResults);
  };

  const handleTypeChange = (typeName) => {
    const newSelectedTypes = filters.selectedTypes.includes(typeName)
      ? filters.selectedTypes.filter((t) => t !== typeName)
      : [...filters.selectedTypes, typeName];

    setFilters((prev) => ({
      ...prev,
      selectedTypes: newSelectedTypes,
    }));
  };

  const matchesSearchTerm = (acc) => {
    if (!destination) return true;
    const term = destination.toLowerCase();
    return (
      acc.name?.toLowerCase().includes(term) ||
      acc.city?.toLowerCase().includes(term) ||
      acc.province?.toLowerCase().includes(term) ||
      acc.type?.name?.toLowerCase().includes(term)
    );
  };

  const visibleResults = filteredResults.filter(matchesSearchTerm);
  const groupedVisibleResults = groupByType(visibleResults);

  const getDiscountedPrice = (accommodation) => {
    const originalPrice = accommodation.price_per_night;
    const discountPercent = accommodation.discount;

    if (typeof discountPercent === "number" && discountPercent > 0) {
      return Math.round(originalPrice * (1 - discountPercent / 100));
    }

    return originalPrice;
  };

  const DiscountedPrice = ({ accommodation }) => {
    const originalPrice = accommodation.price_per_night;
    const discountPercent = accommodation.discount;
    const discounted = getDiscountedPrice(accommodation);

    return (
      <div className="d-flex align-items-baseline mb-2">
        {typeof discountPercent === "number" && discountPercent > 0 && (
          <>
            <span className="text-decoration-line-through text-secondary me-2">
              {originalPrice.toLocaleString()}
            </span>
            <span className="text-danger fw-bold me-3">
              ประหยัด {discountPercent}%
            </span>
          </>
        )}
        <span
          className={`h5 fw-bold ${
            discountPercent > 0 ? "text-danger" : "text-success"
          }`}
        >
          {discounted.toLocaleString()} บาท
        </span>
      </div>
    );
  };

  return (
    <Container className="my-4">
      <SearchBox resetFilter={resetFilters} />
      
    </Container>
  );
};

export default SearchPage;
