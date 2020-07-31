import { startOfDay, addHours, format } from 'date-fns';

const verifyIsCacelable = (appointment) => {
  if (startOfDay(appointment.date) < startOfDay(new Date())) {
    return false;
  }
  const hourMoreTwo = format(
    addHours(new Date(), 2),
    "yyyy-MM-dd'T'HH:mm:ssxxx"
  );
  const hourAppointmentConv = format(
    appointment.date,
    "yyyy-MM-dd'T'HH:mm:ssxxx"
  );
  if (hourAppointmentConv <= hourMoreTwo) {
    return false;
  }
  return true;
};
export default verifyIsCacelable;
