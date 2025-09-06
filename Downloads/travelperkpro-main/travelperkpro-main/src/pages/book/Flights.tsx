import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

const Flights = () => {
  useEffect(() => { document.title = "Book Flights — TravelPerk Pro"; }, []);
  return <BookingForm mode="flight" />;
};

export default Flights;
