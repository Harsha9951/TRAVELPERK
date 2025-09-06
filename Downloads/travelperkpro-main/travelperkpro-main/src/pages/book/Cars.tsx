import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

const Cars = () => {
  useEffect(() => { document.title = "Book Cars — TravelPerk Pro"; }, []);
  return <BookingForm mode="car" />;
};

export default Cars;
