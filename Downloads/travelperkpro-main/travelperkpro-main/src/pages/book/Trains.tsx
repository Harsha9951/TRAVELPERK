import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

const Trains = () => {
  useEffect(() => { document.title = "Book Trains — TravelPerk Pro"; }, []);
  return <BookingForm mode="train" />;
};

export default Trains;
