import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClinic } from '../context/ClinicContext';
import { DepartmentId } from '../types/clinic';

interface BookActionButtonProps {
  departmentId?: DepartmentId;
  serviceId?: string;
  doctorId?: string;
  sourceLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const BookActionButton: React.FC<BookActionButtonProps> = ({
  departmentId,
  serviceId,
  doctorId,
  sourceLabel,
  children,
  className = '',
}) => {
  const navigate = useNavigate();
  const { setBookingPrefill } = useClinic();

  const handleClick = () => {
    setBookingPrefill({
      departmentId: departmentId || '',
      serviceId: serviceId || '',
      doctorId: doctorId || '',
      fromSourceLabel: sourceLabel,
    });
    navigate('/book');
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};
