const db = require("../models");
const Accommodation = db.accommodation;
const Type = db.type;
const User = db.user;
const Booking = db.booking;
const Promotion = db.promotion;
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
    try {
        const accommodation = await Accommodation.findAll({
            include: [
                {
                    model: Type,
                    attributes: ["name"]
                }
            ],
            order: [['id', 'ASC']],
             
        });
        res.status(200).json(accommodation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accommodations" });
    }
}



exports.getSearch = async (req, res) => {
  try {
    const { destination, guests, checkIn, checkOut, onlyAvailable } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "Please provide checkIn and checkOut dates." });
    }

    const parsedCheckIn = new Date(checkIn);
    const parsedCheckOut = new Date(checkOut);

    // 1. Include condition for Type
    const includeCondition = {
      model: Type,
      attributes: ["id", "name"],
      required: true
    };

    if (destination && destination !== "ทั้งหมด" && destination.toLowerCase() !== "all") {
      includeCondition.where = {
        name: { [Op.like]: `${destination}%` }
      };
    }

    // 2. ดึง accommodation ทั้งหมดที่รองรับ guests
    const accommodations = await Accommodation.findAll({
      include: [includeCondition],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: guests ? {
        capacity: { [Op.gte]: parseInt(guests) }
      } : undefined
    });

    // 3. ดึง bookings ที่ยัง active อยู่ในช่วงเวลานั้น และ paymentStatus == true
    const bookings = await Booking.findAll({
      where: {
        paymentStatus: true,
        [Op.and]: [
          { checkInDate: { [Op.lte]: parsedCheckOut } },
          { checkOutDate: { [Op.gte]: parsedCheckIn } }
        ]
      }
    });

    // 4. นับจำนวน booking ต่อ accommodationId
    const bookingCount = {};
    bookings.forEach(b => {
      const accId = b.accommodationId;
      bookingCount[accId] = (bookingCount[accId] || 0) + 1;
    });

    // 5. ใส่ availableRooms ลงในผลลัพธ์
    const results = accommodations.map(acc => {
      const bookedRooms = bookingCount[acc.id] || 0;
      const availableRooms = acc.total_rooms - bookedRooms;
      return {
        ...acc.toJSON(),
        availableRooms: availableRooms > 0 ? availableRooms : 0
      };
    });

    // 6. กรองเฉพาะที่มีห้องว่างถ้าผู้ใช้กำหนด
    let finalResults = results;
    if (onlyAvailable === 'true') {
      finalResults = results.filter(acc => acc.availableRooms > 0);
    }

    res.status(200).json(finalResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching accommodations" });
  }
};





exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            attributes: [
                'adult',
                'child',
                'checkInDate',
                'checkOutDate',
                'totalNights',
                'totalPrice'
            ],
            include: [
                {
                    model: Accommodation,
                    attributes: ['name']
                },
                {
                    model: User,
                    attributes: ['name', 'lastname', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const bookingsWithUpdatedPrice = bookings.map(booking => {
    const price = booking.totalPrice;
    const nights = booking.totalNights;

    const updatedPrice = price * nights;

    return {
        ...booking.toJSON(),
        updatedPrice
    };
});

        res.status(200).json(bookingsWithUpdatedPrice);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Error retrieving bookings." });
    }
};


exports.getAllPromotion = async (req, res) => {
    try {
        const promotions = await Promotion.findAll({
            attributes: [
                'id',
                'condition',
                'percent',
                'period',
                'description'
            ],
            include: [
                {
                    model: Type,
                    attributes: [
                        
                        'name'
                    ]
                },
            ]
        });
        res.status(200).json(promotions); // ส่งข้อมูลกลับเป็น JSON
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลโปรโมชั่นได้" });
    }
};


exports.getAvailability = async (req, res) => {
  try {
    // ดึงข้อมูลห้องพักทั้งหมด
    const accommodations = await Accommodation.findAll();

    // ดึงข้อมูล Booking ที่ชำระเงินแล้ว
    const bookings = await Booking.findAll({
      where: {
        paymentStatus: true
      }
    });

    // นับจำนวนห้องที่ถูกจอง สำหรับแต่ละ accommodationId
    const bookedCountByAccommodation = {};

    bookings.forEach(booking => {
      const accommodationId = booking.accommodationId;
      const amount = 1; // สมมุติ 1 booking = 1 ห้อง ถ้ามีฟิลด์จำนวนใน booking ให้แก้ตรงนี้

      if (!bookedCountByAccommodation[accommodationId]) {
        bookedCountByAccommodation[accommodationId] = 0;
      }

      bookedCountByAccommodation[accommodationId] += amount;
    });

    // สร้างข้อมูล availability โดยเพิ่ม bookedRooms และ availableRooms
    const availability = accommodations.map(acc => {
      const bookedRooms = bookedCountByAccommodation[acc.id] || 0;
      const totalRooms = acc.total_rooms || 0;
      const availableRooms = totalRooms - bookedRooms;

      return {
        accommodationName: acc.name,
        total_rooms: totalRooms,
        bookedRooms: bookedRooms,
        availableRooms: availableRooms >= 0 ? availableRooms : 0 // กันกรณีติดลบ
      };
    });

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

