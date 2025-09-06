import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export type BookingMode = "flight" | "hotel" | "car" | "train";

const modeLabels: Record<BookingMode, string> = {
  flight: "Flight",
  hotel: "Hotel",
  car: "Car",
  train: "Train",
};

const schemaByMode: Record<BookingMode, z.ZodObject<any>> = {
  flight: z.object({ from: z.string().min(2), to: z.string().min(2), passengers: z.coerce.number().min(1), clazz: z.string(), dates: z.object({ from: z.date(), to: z.date() }) }),
  train: z.object({ from: z.string().min(2), to: z.string().min(2), passengers: z.coerce.number().min(1), clazz: z.string(), dates: z.object({ from: z.date(), to: z.date() }) }),
  hotel: z.object({ location: z.string().min(2), rooms: z.coerce.number().min(1), dates: z.object({ from: z.date(), to: z.date() }) }),
  car: z.object({ location: z.string().min(2), drivers: z.coerce.number().min(1), type: z.string(), dates: z.object({ from: z.date(), to: z.date() }) }),
};

function nightsBetween(from?: Date, to?: Date) {
  if (!from || !to) return 0;
  const ms = Math.max(0, to.getTime() - from.getTime());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function estimatePrice(mode: BookingMode, values: any) {
  const n = nightsBetween(values?.dates?.from, values?.dates?.to) || 1;
  switch (mode) {
    case "flight":
      return 200 * (values.passengers || 1) * n;
    case "train":
      return 80 * (values.passengers || 1) * n;
    case "hotel":
      return 150 * (values.rooms || 1) * n;
    case "car":
      return 70 * (values.drivers || 1) * n;
  }
}

interface BookingFormProps { mode: BookingMode; }

export const BookingForm = ({ mode }: BookingFormProps) => {
  const schema = useMemo(() => schemaByMode[mode], [mode]);
  type FormValues = z.infer<typeof schema>;
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { dates: undefined } as any });

  const dates = watch("dates" as any);
  const onEstimate = (data: FormValues) => {
    const price = estimatePrice(mode, data);
    toast.info(`${modeLabels[mode]} estimate`, { description: `Approx. ₹${(price * 80)?.toFixed(0)}` });
  };
  const onSubmit = (data: FormValues) => {
    const price = estimatePrice(mode, data);
    toast.success(`${modeLabels[mode]} reserved`, { description: `Holding for ₹${(price * 80)?.toFixed(0)} — redirecting...` });
    setTimeout(() => { window.location.href = "/auth"; }, 800);
  };

  return (
    <section className="min-h-screen snap-start flex items-center bg-background">
      <div className="container">
        <div className="panel-glass rounded-3xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{modeLabels[mode]} booking</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
            {(mode === "flight" || mode === "train") && (
              <>
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input id="from" placeholder="City or airport" {...register("from" as any)} />
                  {(errors as any)?.from && <p className="text-destructive text-xs mt-1">Required</p>}
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input id="to" placeholder="City or airport" {...register("to" as any)} />
                  {(errors as any)?.to && <p className="text-destructive text-xs mt-1">Required</p>}
                </div>
                <div>
                  <Label htmlFor="passengers">Passengers</Label>
                  <Input id="passengers" type="number" min={1} defaultValue={1} {...register("passengers" as any)} />
                </div>
                <div>
                  <Label>Class</Label>
                  <Select onValueChange={(v) => setValue("clazz" as any, v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === "hotel" && (
              <>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City or area" {...register("location" as any)} />
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms</Label>
                  <Input id="rooms" type="number" min={1} defaultValue={1} {...register("rooms" as any)} />
                </div>
              </>
            )}

            {mode === "car" && (
              <>
                <div>
                  <Label htmlFor="location">Pick-up location</Label>
                  <Input id="location" placeholder="City or office" {...register("location" as any)} />
                </div>
                <div>
                  <Label htmlFor="drivers">Drivers</Label>
                  <Input id="drivers" type="number" min={1} defaultValue={1} {...register("drivers" as any)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Car type</Label>
                  <Select onValueChange={(v) => setValue("type" as any, v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label>Dates</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dates?.from && dates?.to ? (
                      <span>
                        {dates.from.toLocaleDateString()} – {dates.to.toLocaleDateString()} ({nightsBetween(dates.from, dates.to)} nights)
                      </span>
                    ) : (
                      <span>Select dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dates}
                    onSelect={(v) => setValue("dates" as any, v as any, { shouldValidate: true })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {(errors as any)?.dates && <p className="text-destructive text-xs mt-1">Select a date range</p>}
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Button type="button" variant="secondary" onClick={handleSubmit(onEstimate)}>Estimate price</Button>
              <Button type="submit" variant="hero" className="hover-scale">Continue</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
