'use client'
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateReserveProps {
    onDateChange: (value: Dayjs | null) => void;
}

export default function DateReserve({ onDateChange }: DateReserveProps) {
    const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Select Booking Date"
                value={reserveDate}
                onChange={(newValue) => {
                    setReserveDate(newValue)
                    onDateChange(newValue)
                }}
                slotProps={{
                textField: {
                    fullWidth: true,
                    variant: 'standard',
                    sx: {
                        "& .MuiInputLabel-root": {
                            color: "#9ca3af",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#eab308",
                        },
                        "& .MuiInputBase-input": {
                            color: "#ffffff",
                        },
                        // เพิ่มตรงนี้ — แก้สี placeholder sections (MM/DD/YYYY)
                        "& .MuiInputBase-input.MuiInput-input": {
                            color: "#ffffff",
                        },
                        "& .MuiDateField-section": {
                            color: "#ffffff",
                        },
                        "& .MuiDateField-section.Mui-selected": {
                            backgroundColor: "#eab308",
                            color: "#000000",
                        },
                        "& .MuiInput-underline:before": {
                            borderBottomColor: "#4b5563",
                        },
                        "& .MuiInput-underline:hover:before": {
                            borderBottomColor: "#eab308",
                        },
                        "& .MuiInput-underline:after": {
                            borderBottomColor: "#eab308",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "#9ca3af",
                        },
                    }
                }
            }}
            />
        </LocalizationProvider>
    );
}