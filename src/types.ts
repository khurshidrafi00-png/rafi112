export interface Doctor {
  id: string;
  nameBD: string;
  nameEN: string;
  titleBD: string;
  titleEN: string;
  qualificationsBD: string;
  qualificationsEN: string;
  designationBD: string;
  designationEN: string;
  scheduleBD: string;
  scheduleEN: string;
  daysBD: string[];
  daysEN: string[];
  categories: string[];
  phoneSerials: string[];
  image: string;
  specialtiesBD?: string[];
  specialtiesEN?: string[];
  chamberBD: string;
  chamberEN: string;
}

export interface Test {
  id: string;
  nameEN: string;
  nameBD: string;
  categoryEN: string;
  categoryBD: string;
  preparationEN: string;
  preparationBD: string;
  priceBD: string;
  popular: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  age: string;
  date: string;
  doctorId: string;
  doctorNameBD: string;
  doctorNameEN: string;
  status: 'Pending' | 'Confirmed';
  serialNo: string;
  notes: string;
  createdAt: string;
}
