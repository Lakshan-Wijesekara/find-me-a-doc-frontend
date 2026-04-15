import React, { useState } from 'react';
import { bookNewAppointment } from "@/services/appointmentService.ts";

// Interface for the booking modal (Parent component passes these info)
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId: number;
    doctorName: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen, onClose, doctorId, doctorName
}) => {
    // Input state: User typed info
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Stateus state - idle, loading, success, error
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // If the modal should not be visible, as is open is false,
    if (!isOpen) return null;

    // Submit step
    const handleBooking = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Stop browser from page refreshing otherwise it clears the states
        setStatus('loading');

        try {
            await bookNewAppointment({
                doctorId: doctorId,
                appointmentDate: date,
                appointmentTime: time + ":00", // Backend needs seconds
            });

            setStatus('success');

            //Close the modal after 2 seconds
            setTimeout(() => {
                onClose();
                setStatus('idle'); // Reset the status for next time
                setDate('');
                setTime('');
            }, 2000);
        }
        catch (error: any) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
        }
    };

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
                    <form onSubmit={handleBooking} className="flex flex-col gap-4">

                        {status === 'error' && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Select Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Select Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
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
