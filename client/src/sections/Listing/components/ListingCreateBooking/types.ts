export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}
