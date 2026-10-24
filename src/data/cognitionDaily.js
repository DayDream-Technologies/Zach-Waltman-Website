/** Local-resource categories that match this foundation's work. Keys are Cognition Daily's. */
export const cognitionCategories = [
  { key: 'psychology', label: 'Psychology' },
  { key: 'psychiatry', label: 'Psychiatry and medication' },
  { key: 'crisis_support', label: 'Crisis support' },
  { key: 'education_support', label: 'School and college support' },
  { key: 'support_groups', label: 'Peer and support groups' },
  { key: 'substance_use', label: 'Substance use treatment' },
  { key: 'caregiver_support', label: 'Family and caregiver support' },
  { key: 'social_groups', label: 'Social groups' },
  { key: 'eating_disorder_treatment', label: 'Eating disorder treatment' },
];

export const cognitionJurisdictions = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'],
  ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['PR', 'Puerto Rico'],
  ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'],
  ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
].map(([code, name]) => ({ code, name }));

const STATE_FIPS_TO_CODE = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
  '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
  '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
  '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY', '72': 'PR',
};

const RESOURCES_URL = 'https://cognitiondaily.net/Resources';

/**
 * Cognition Daily reads tab, zip, state, county, and category on /Resources.
 * A 5-digit ZIP wins over state. County is a 5-digit FIPS code and only applies with a state.
 */
export function cognitionDailyResourcesUrl({ zip = '', state = '', county = '', category = '' } = {}) {
  const params = new URLSearchParams();
  params.set('tab', 'local');
  const zipDigits = String(zip).replace(/\D/g, '').slice(0, 5);
  if (zipDigits.length === 5) {
    params.set('zip', zipDigits);
  } else if (state) {
    params.set('state', state);
    const countyDigits = String(county).replace(/\D/g, '');
    if (countyDigits.length === 5) params.set('county', countyDigits);
  }
  if (category && /^[a-z0-9_]+$/.test(category)) params.set('category', category);
  return `${RESOURCES_URL}?${params.toString()}`;
}

let countyCache = null;

export async function countiesForState(stateCode) {
  if (!stateCode) return [];
  if (!countyCache) {
    const [{ feature }, atlas] = await Promise.all([
      import('topojson-client'),
      import('us-atlas/counties-10m.json'),
    ]);
    const topology = atlas.default || atlas;
    const collection = feature(topology, topology.objects.counties);
    const byState = {};
    (collection.features || []).forEach((item) => {
      const fips = String(item.id || '').padStart(5, '0');
      const code = STATE_FIPS_TO_CODE[fips.slice(0, 2)];
      if (!code || fips.length !== 5) return;
      if (!byState[code]) byState[code] = [];
      byState[code].push({ fips, name: item.properties?.name || fips });
    });
    Object.values(byState).forEach((list) => {
      list.sort((a, b) => a.name.localeCompare(b.name));
    });
    countyCache = byState;
  }
  return countyCache[stateCode] || [];
}
