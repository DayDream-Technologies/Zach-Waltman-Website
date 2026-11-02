const masses = [
  ['2026-11-01', 'November 1, 2026', '-06:00'],
  ['2026-12-06', 'December 6, 2026', '-06:00'],
  ['2027-01-03', 'January 3, 2027', '-06:00'],
  ['2027-02-07', 'February 7, 2027', '-06:00'],
  ['2027-03-14', 'March 14, 2027', '-05:00'],
  ['2027-04-04', 'April 4, 2027', '-05:00'],
  ['2027-05-16', 'May 16, 2027', '-05:00'],
  ['2027-06-06', 'June 6, 2027', '-05:00'],
  ['2027-07-04', 'July 4, 2027', '-05:00'],
  ['2027-08-01', 'August 1, 2027', '-05:00'],
  ['2027-09-05', 'September 5, 2027', '-05:00'],
  ['2027-10-03', 'October 3, 2027', '-05:00'],
];

export const events = masses.map(([day, label, offset]) => ({
  id: `mass-${day}`,
  title: 'Mass in Zach’s name',
  summary: `9:30 Mass at Saint Francis Xavier in Wilmette on ${label}.`,
  location: 'Saint Francis Xavier, Wilmette',
  label,
  start: `${day}T09:30:00${offset}`,
  end: `${day}T10:30:00${offset}`,
  category: 'memorial',
  sample: false,
}));
