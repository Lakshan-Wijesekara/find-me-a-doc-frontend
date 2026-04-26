import React, {useEffect, useState} from 'react';
import {bookNewAppointment, getAvailableSlots} from "@/services/appointmentService.ts";
import { Calendar } from "@/components/ui/calendar";

// Interface for the booking modal (Parent component passes these info)
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId: number;
    doctorName: string;
    aiBrief: any;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen, onClose, doctorId, doctorName, aiBrief
}) => {
    // Input state: date state
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');

    // To manage available time slots
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);

    // Stateus state - idle, loading, success, error
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!date) {
            setAvailableSlots([]);
            setTime('');
            return;
        }

        const fetchAvailableSlots = async () => {
            setIsFetchingSlots(true);
            setTime('');

            try {
                const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

                // Calling backend to get the slots for this specific day
                const slots = await getAvailableSlots(doctorId, formattedDate);

                // Format "09:00:00" to "09:00" for the UI buttons
                const formattedSlots = slots.map(slot =>
                    slot.startTime.substring(0, 5)
                );
                setAvailableSlots(formattedSlots);
            } catch (error) {
                console.error("Failed to fetch slots", error);
                setAvailableSlots([]);
            } finally {
                setIsFetchingSlots(false);
            }
        };

        void fetchAvailableSlots(); // Ignoring the promise warning since we're handling it inside the function
    }, [date, doctorId]); // Watches the date state


        // The Event Handler: Runs when the user clicks "Confirm"
        const handleBooking = async (e: React.SyntheticEvent) => {
            e.preventDefault();

            if (!date || !time) {
                setErrorMessage("Please select a valid date and time.");
                return;
            }

            setStatus('loading');

            try {
                const formatDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

                await bookNewAppointment({
                    doctorId: doctorId,
                    appointmentDate: formatDate,
                    appointmentTime: time + ":00",
                    aiBrief: aiBrief || null
                });

                setStatus('success');

                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setDate(undefined);
                    setTime('');
                }, 2000);
            }
            catch (error: any) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
            }
        };

    if (!isOpen) return null;

    //UI
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
                <h2 className="mb-6 text-xl font-semibold tracking-tight">Book with {doctorName}</h2>

                {status === 'success' ? (
                    <div className="py-6 text-center text-sm font-medium text-green-600 dark:text-green-400">
                        🎉 Appointment successfully booked!
                    </div>
                ) : (
                    <form onSubmit={handleBooking} className="flex flex-col gap-5">

                        {status === 'error' && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                                {errorMessage}
                            </div>
                        )}

                        {/* DATE SELECTION */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Select Date</label>
                            <div className="flex justify-center rounded-md border border-input bg-background p-2">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </div>
                        </div>

                        {/* DYNAMIC TIME GRID */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Select Time</label>

                            {!date ? (
                                <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/50">
                                    Please select a date to view available times.
                                </div>
                            ) : isFetchingSlots ? (
                                <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground animate-pulse bg-muted/50">
                                    Loading available slots...
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/50">
                                    No available slots for this date.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 mt-2">
                                    {availableSlots.map((slotTime) => (
                                        <button
                                            key={slotTime}
                                            type="button"
                                            onClick={() => setTime(slotTime)}
                                            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                                ${time === slotTime
                                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        >
                                            {slotTime}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-4 flex justify-end gap-3 pt-2 border-t border-border">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Booking...' : 'Confirm'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
