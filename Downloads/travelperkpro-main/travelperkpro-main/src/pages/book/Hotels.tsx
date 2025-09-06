import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

const Hotels = () => {
  useEffect(() => { document.title = "Book Hotels — TravelPerk Pro"; }, []);
  return <BookingForm mode="hotel" />;
};

export default Hotels;
