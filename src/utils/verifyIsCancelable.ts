import { startOfDay, addHours, format } from 'date-fns';

const verifyIsCancelable = (appointment: Date): boolean => {
  if (startOfDay(appointment) < startOfDay(new Date())) {
    return false;
  }
  const hourMoreTwo = format(
    addHours(new Date(), 2),
    "yyyy-MM-dd'T'HH:mm:ssxxx"
  );
  const hourAppointmentConv = format(
    appointment,
    "yyyy-MM-dd'T'HH:mm:ssxxx"
  );
  if (hourAppointmentConv <= hourMoreTwo) {
    return false;
  }
  return true;
};

export default verifyIsCancelable;

