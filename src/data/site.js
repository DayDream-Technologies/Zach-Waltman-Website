export const site = {
  name: 'Zach Waltman Foundation',
  shortName: 'ZWF',
  number: '84',
  mission:
    'The Zach Waltman Foundation aims to provide immediate mental health resources and coordinated care for students.',
  vision:
    'The Zach Waltman Foundation intends to establish 24/7 fully staffed on-campus safe spaces for students. We aspire to create a more responsive and compassionate system of providing care and access for students seeking mental health support. Through collaboration, advocacy, and education, we will strengthen coordination among campus services and health care providers, ensuring that every young person is seen, heard, supported, and connected to the care they need.',
  gofundme:
    'https://www.gofundme.com/f/zach-waltman-mental-health-crisis-campus-suicide-prevention',
  email: 'ZachWaltmanFoundation@gmail.com',
  phone: null,
};

export const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/zachs-story', label: "Zach's Story" },
  { to: '/resources', label: 'Resources' },
  { to: '/events', label: 'Events' },
  { to: '/get-involved', label: 'Get Involved' },
];

export const crisisLines = [
  {
    id: '988',
    name: '988 Suicide & Crisis Lifeline',
    action: 'Call or text 988',
    href: 'tel:988',
    detail: 'Free, confidential support 24 hours a day, in English and Spanish.',
    extraHref: 'https://988lifeline.org',
    extraLabel: '988lifeline.org',
  },
  {
    id: 'ctl',
    name: 'Crisis Text Line',
    action: 'Text HOME to 741741',
    href: 'sms:741741&body=HOME',
    detail: 'Text with a trained crisis counselor, any time.',
    extraHref: 'https://www.crisistextline.org',
    extraLabel: 'crisistextline.org',
  },
  {
    id: '911',
    name: 'Emergency services',
    action: 'Call 911',
    href: 'tel:911',
    detail: 'If you or someone with you is in immediate danger.',
    extraHref: null,
    extraLabel: null,
  },
];

export const pillars = [
  {
    title: 'Immediate resources',
    text: 'A student in distress should not have to hunt for a phone number. We point people to help that is open now, and we are building the on-campus version of that same idea.',
  },
  {
    title: 'Coordinated care',
    text: 'Campus counseling, health services, and outside providers too often work in separate lanes. We want them talking to each other so a student is not handed off and lost.',
  },
  {
    title: '24/7 safe spaces',
    text: 'Our aim is a fully staffed place on campus where a student can go at 2 a.m. and find a person, not a locked door and a voicemail.',
  },
];

export const values = [
  {
    title: 'Teamwork',
    front: 'Zach played hockey. Care works the same way.',
    back: 'No one covers the whole ice alone. Students, families, campuses, and clinicians each have a role, and the foundation exists to connect them.',
  },
  {
    title: 'Presence',
    front: 'Being there is the first intervention.',
    back: 'A staffed room, a returned call, a friend who stays. Presence is not a substitute for clinical care. It is how people reach it.',
  },
  {
    title: 'Coordination',
    front: 'Handoffs are where students fall through.',
    back: 'We will push campuses and providers to share enough information, with consent, that a student does not have to start over at every door.',
  },
  {
    title: 'Honesty',
    front: 'We will not pretend programs exist before they do.',
    back: 'This site says what is real, what is still being built, and where the family still needs to fill in the story. Trust depends on that.',
  },
  {
    title: 'Hope',
    front: 'Struggle is not the whole story.',
    back: 'We talk about Zach as the person he was: a brother, a teammate, a friend who made rooms warmer. The work ahead is about more students getting to stay.',
  },
  {
    title: 'Access',
    front: 'Help that is hard to find is help that arrives late.',
    back: 'Hours, language, cost, and stigma all close doors. A compassionate system is one a student can actually walk into.',
  },
];

export const careSteps = [
  {
    title: 'A student reaches out',
    text: 'In person, by phone, or by text. The first response is a person, the same hour.',
  },
  {
    title: 'A safe space receives them',
    text: 'Somewhere on campus that is staffed, calm, and open overnight, not only during business hours.',
  },
  {
    title: 'Campus services coordinate',
    text: 'Counseling, health, residence life, and the people who already know the student share one plan.',
  },
  {
    title: 'Care continues',
    text: 'A warm handoff to a clinician or a follow-up the next day, so support does not end at the doorway.',
  },
];

export const boardSeats = [
  {
    role: 'Chair',
    note: 'The family will name this seat.',
  },
  {
    role: 'Treasurer',
    note: 'Seat to be announced.',
  },
  {
    role: 'Clinical advisor',
    note: 'A licensed clinician should hold this seat. Not yet named.',
  },
  {
    role: 'Campus programs',
    note: 'Seat to be announced.',
  },
];

export const designations = [
  { id: 'where_needed', label: 'Where it is needed most' },
  { id: 'safe_spaces', label: 'On-campus safe spaces' },
  { id: 'education', label: 'Education and training' },
  { id: 'peer_support', label: 'Peer support' },
];

export const giftImpacts = [
  { cents: 2500, text: 'Helps print and share crisis-resource cards for a residence hall. Illustrative only.' },
  { cents: 5000, text: 'Contributes to a training session for peer supporters. Illustrative only.' },
  { cents: 10000, text: 'Supports a campus conversation on coordinated care. Illustrative only.' },
  { cents: 25000, text: 'Moves a safe-space pilot closer to overnight staffing. Illustrative only.' },
];

export function impactForAmount(cents) {
  const sorted = [...giftImpacts].sort((a, b) => a.cents - b.cents);
  let match = sorted[0];
  sorted.forEach((item) => {
    if (cents >= item.cents) match = item;
  });
  return match?.text ?? '';
}
