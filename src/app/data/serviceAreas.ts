export type AreaType = 'NEIGHBORHOOD' | 'CITY' | 'COUNTY' | 'STATE' | 'COUNTRY'

export type AreaOption = {
  type: AreaType
  value: string      // canonical name stored in DB
  placeId: string    // external reference for future boundary lookup
  label: string      // display string shown in UI
  region?: string    // optional grouping hint (e.g. "Seattle", "King County")
}

// ---------------------------------------------------------------------------
// NEIGHBORHOODS — Seattle metro focus to start. Add more as your user base grows.
// placeId uses OSM relation IDs where available (format: "osm:R{id}")
// ---------------------------------------------------------------------------
const neighborhoods: AreaOption[] = [
  { type: 'NEIGHBORHOOD', value: 'Ballard',           placeId: 'osm:R1682398',  label: 'Ballard',           region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Capitol Hill',      placeId: 'osm:R1682399',  label: 'Capitol Hill',      region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Fremont',           placeId: 'osm:R1682400',  label: 'Fremont',           region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Green Lake',        placeId: 'osm:R1682401',  label: 'Green Lake',        region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Greenwood',         placeId: 'osm:R1682402',  label: 'Greenwood',         region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Georgetown',        placeId: 'osm:R1682403',  label: 'Georgetown',        region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Central District',  placeId: 'osm:R1682404',  label: 'Central District',  region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Columbia City',     placeId: 'osm:R1682405',  label: 'Columbia City',     region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Beacon Hill',       placeId: 'osm:R1682406',  label: 'Beacon Hill',       region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Rainier Valley',    placeId: 'osm:R1682407',  label: 'Rainier Valley',    region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Rainier Beach',     placeId: 'osm:R1682408',  label: 'Rainier Beach',     region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'West Seattle',      placeId: 'osm:R1682409',  label: 'West Seattle',      region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'SoDo',              placeId: 'osm:R1682410',  label: 'SoDo',              region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'South Lake Union',  placeId: 'osm:R1682411',  label: 'South Lake Union',  region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'First Hill',        placeId: 'osm:R1682412',  label: 'First Hill',        region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Queen Anne',        placeId: 'osm:R1682413',  label: 'Queen Anne',        region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Magnolia',          placeId: 'osm:R1682414',  label: 'Magnolia',          region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Eastlake',          placeId: 'osm:R1682415',  label: 'Eastlake',          region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Wallingford',       placeId: 'osm:R1682416',  label: 'Wallingford',       region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'University District', placeId: 'osm:R1682417', label: 'University District', region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Northgate',         placeId: 'osm:R1682418',  label: 'Northgate',         region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Lake City',         placeId: 'osm:R1682419',  label: 'Lake City',         region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Wedgwood',          placeId: 'osm:R1682420',  label: 'Wedgwood',          region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'View Ridge',        placeId: 'osm:R1682421',  label: 'View Ridge',        region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Laurelhurst',       placeId: 'osm:R1682422',  label: 'Laurelhurst',       region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Montlake',          placeId: 'osm:R1682423',  label: 'Montlake',          region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Madison Park',      placeId: 'osm:R1682424',  label: 'Madison Park',      region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Madrona',           placeId: 'osm:R1682425',  label: 'Madrona',           region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Leschi',            placeId: 'osm:R1682426',  label: 'Leschi',            region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Industrial District', placeId: 'osm:R1682427', label: 'Industrial District', region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'Delridge',          placeId: 'osm:R1682428',  label: 'Delridge',          region: 'Seattle' },
  { type: 'NEIGHBORHOOD', value: 'White Center',      placeId: 'osm:R1682429',  label: 'White Center',      region: 'King County' },
  { type: 'NEIGHBORHOOD', value: 'Skyway',            placeId: 'osm:R1682430',  label: 'Skyway',            region: 'King County' },
]

// ---------------------------------------------------------------------------
// CITIES — Washington State focus. Census FIPS place codes.
// ---------------------------------------------------------------------------
const cities: AreaOption[] = [
  { type: 'CITY', value: 'Seattle',         placeId: 'census:5363000',  label: 'Seattle, WA' },
  { type: 'CITY', value: 'Spokane',         placeId: 'census:5367000',  label: 'Spokane, WA' },
  { type: 'CITY', value: 'Tacoma',          placeId: 'census:5370000',  label: 'Tacoma, WA' },
  { type: 'CITY', value: 'Vancouver',       placeId: 'census:5374060',  label: 'Vancouver, WA' },
  { type: 'CITY', value: 'Bellevue',        placeId: 'census:5305280',  label: 'Bellevue, WA' },
  { type: 'CITY', value: 'Kent',            placeId: 'census:5335275',  label: 'Kent, WA' },
  { type: 'CITY', value: 'Everett',         placeId: 'census:5323515',  label: 'Everett, WA' },
  { type: 'CITY', value: 'Renton',          placeId: 'census:5357745',  label: 'Renton, WA' },
  { type: 'CITY', value: 'Kirkland',        placeId: 'census:5336745',  label: 'Kirkland, WA' },
  { type: 'CITY', value: 'Bellingham',      placeId: 'census:5305770',  label: 'Bellingham, WA' },
  { type: 'CITY', value: 'Kennewick',       placeId: 'census:5335415',  label: 'Kennewick, WA' },
  { type: 'CITY', value: 'Yakima',          placeId: 'census:5380010',  label: 'Yakima, WA' },
  { type: 'CITY', value: 'Redmond',         placeId: 'census:5357020',  label: 'Redmond, WA' },
  { type: 'CITY', value: 'Shoreline',       placeId: 'census:5363480',  label: 'Shoreline, WA' },
  { type: 'CITY', value: 'Sammamish',       placeId: 'census:5361045',  label: 'Sammamish, WA' },
  { type: 'CITY', value: 'Burien',          placeId: 'census:5309130',  label: 'Burien, WA' },
  { type: 'CITY', value: 'Federal Way',     placeId: 'census:5323515',  label: 'Federal Way, WA' },
  { type: 'CITY', value: 'Pasco',           placeId: 'census:5352960',  label: 'Pasco, WA' },
  { type: 'CITY', value: 'Marysville',      placeId: 'census:5343955',  label: 'Marysville, WA' },
  { type: 'CITY', value: 'South Hill',      placeId: 'census:5365415',  label: 'South Hill, WA' },
  { type: 'CITY', value: 'Lakewood',        placeId: 'census:5338038',  label: 'Lakewood, WA' },
  { type: 'CITY', value: 'Richland',        placeId: 'census:5358235',  label: 'Richland, WA' },
  { type: 'CITY', value: 'Auburn',          placeId: 'census:5303736',  label: 'Auburn, WA' },
  { type: 'CITY', value: 'Bothell',         placeId: 'census:5307380',  label: 'Bothell, WA' },
  { type: 'CITY', value: 'Olympia',         placeId: 'census:5351300',  label: 'Olympia, WA' },
  { type: 'CITY', value: 'Edmonds',         placeId: 'census:5321305',  label: 'Edmonds, WA' },
  { type: 'CITY', value: 'Puyallup',        placeId: 'census:5356695',  label: 'Puyallup, WA' },
  { type: 'CITY', value: 'Bremerton',       placeId: 'census:5308100',  label: 'Bremerton, WA' },
  { type: 'CITY', value: 'Lynnwood',        placeId: 'census:5341505',  label: 'Lynnwood, WA' },
  { type: 'CITY', value: 'Spokane Valley',  placeId: 'census:5367167',  label: 'Spokane Valley, WA' },
  { type: 'CITY', value: 'Tukwila',         placeId: 'census:5372800',  label: 'Tukwila, WA' },
  { type: 'CITY', value: 'Des Moines',      placeId: 'census:5317635',  label: 'Des Moines, WA' },
  { type: 'CITY', value: 'Issaquah',        placeId: 'census:5333210',  label: 'Issaquah, WA' },
  { type: 'CITY', value: 'Kenmore',         placeId: 'census:5335170',  label: 'Kenmore, WA' },
  { type: 'CITY', value: 'Mount Vernon',    placeId: 'census:5347560',  label: 'Mount Vernon, WA' },
  { type: 'CITY', value: 'Walla Walla',     placeId: 'census:5374865',  label: 'Walla Walla, WA' },
]

// ---------------------------------------------------------------------------
// COUNTIES — All 39 Washington counties. Census FIPS county codes.
// ---------------------------------------------------------------------------
const counties: AreaOption[] = [
  { type: 'COUNTY', value: 'King County',        placeId: 'census:53033', label: 'King County, WA' },
  { type: 'COUNTY', value: 'Pierce County',      placeId: 'census:53053', label: 'Pierce County, WA' },
  { type: 'COUNTY', value: 'Snohomish County',   placeId: 'census:53061', label: 'Snohomish County, WA' },
  { type: 'COUNTY', value: 'Spokane County',     placeId: 'census:53063', label: 'Spokane County, WA' },
  { type: 'COUNTY', value: 'Clark County',       placeId: 'census:53011', label: 'Clark County, WA' },
  { type: 'COUNTY', value: 'Thurston County',    placeId: 'census:53067', label: 'Thurston County, WA' },
  { type: 'COUNTY', value: 'Kitsap County',      placeId: 'census:53035', label: 'Kitsap County, WA' },
  { type: 'COUNTY', value: 'Yakima County',      placeId: 'census:53077', label: 'Yakima County, WA' },
  { type: 'COUNTY', value: 'Whatcom County',     placeId: 'census:53073', label: 'Whatcom County, WA' },
  { type: 'COUNTY', value: 'Benton County',      placeId: 'census:53005', label: 'Benton County, WA' },
  { type: 'COUNTY', value: 'Chelan County',      placeId: 'census:53007', label: 'Chelan County, WA' },
  { type: 'COUNTY', value: 'Skagit County',      placeId: 'census:53057', label: 'Skagit County, WA' },
  { type: 'COUNTY', value: 'Cowlitz County',     placeId: 'census:53015', label: 'Cowlitz County, WA' },
  { type: 'COUNTY', value: 'Grant County',       placeId: 'census:53025', label: 'Grant County, WA' },
  { type: 'COUNTY', value: 'Franklin County',    placeId: 'census:53021', label: 'Franklin County, WA' },
  { type: 'COUNTY', value: 'Island County',      placeId: 'census:53029', label: 'Island County, WA' },
  { type: 'COUNTY', value: 'Lewis County',       placeId: 'census:53041', label: 'Lewis County, WA' },
  { type: 'COUNTY', value: 'Mason County',       placeId: 'census:53045', label: 'Mason County, WA' },
  { type: 'COUNTY', value: 'Okanogan County',    placeId: 'census:53047', label: 'Okanogan County, WA' },
  { type: 'COUNTY', value: 'Walla Walla County', placeId: 'census:53071', label: 'Walla Walla County, WA' },
  { type: 'COUNTY', value: 'Clallam County',     placeId: 'census:53009', label: 'Clallam County, WA' },
  { type: 'COUNTY', value: 'Jefferson County',   placeId: 'census:53031', label: 'Jefferson County, WA' },
  { type: 'COUNTY', value: 'Douglas County',     placeId: 'census:53017', label: 'Douglas County, WA' },
  { type: 'COUNTY', value: 'Grays Harbor County',placeId: 'census:53027', label: 'Grays Harbor County, WA' },
  { type: 'COUNTY', value: 'Pacific County',     placeId: 'census:53049', label: 'Pacific County, WA' },
  { type: 'COUNTY', value: 'San Juan County',    placeId: 'census:53055', label: 'San Juan County, WA' },
  { type: 'COUNTY', value: 'Skamania County',    placeId: 'census:53059', label: 'Skamania County, WA' },
  { type: 'COUNTY', value: 'Stevens County',     placeId: 'census:53065', label: 'Stevens County, WA' },
  { type: 'COUNTY', value: 'Asotin County',      placeId: 'census:53003', label: 'Asotin County, WA' },
  { type: 'COUNTY', value: 'Adams County',       placeId: 'census:53001', label: 'Adams County, WA' },
  { type: 'COUNTY', value: 'Columbia County',    placeId: 'census:53013', label: 'Columbia County, WA' },
  { type: 'COUNTY', value: 'Ferry County',       placeId: 'census:53019', label: 'Ferry County, WA' },
  { type: 'COUNTY', value: 'Garfield County',    placeId: 'census:53023', label: 'Garfield County, WA' },
  { type: 'COUNTY', value: 'Klickitat County',   placeId: 'census:53039', label: 'Klickitat County, WA' },
  { type: 'COUNTY', value: 'Lincoln County',     placeId: 'census:53043', label: 'Lincoln County, WA' },
  { type: 'COUNTY', value: 'Pend Oreille County',placeId: 'census:53051', label: 'Pend Oreille County, WA' },
  { type: 'COUNTY', value: 'Wahkiakum County',   placeId: 'census:53069', label: 'Wahkiakum County, WA' },
  { type: 'COUNTY', value: 'Whitman County',     placeId: 'census:53075', label: 'Whitman County, WA' },
  { type: 'COUNTY', value: 'Kittitas County',    placeId: 'census:53037', label: 'Kittitas County, WA' },
]

// ---------------------------------------------------------------------------
// STATES — All 50 US states. Census FIPS state codes.
// ---------------------------------------------------------------------------
const states: AreaOption[] = [
  { type: 'STATE', value: 'Alabama',        placeId: 'census:01', label: 'Alabama' },
  { type: 'STATE', value: 'Alaska',         placeId: 'census:02', label: 'Alaska' },
  { type: 'STATE', value: 'Arizona',        placeId: 'census:04', label: 'Arizona' },
  { type: 'STATE', value: 'Arkansas',       placeId: 'census:05', label: 'Arkansas' },
  { type: 'STATE', value: 'California',     placeId: 'census:06', label: 'California' },
  { type: 'STATE', value: 'Colorado',       placeId: 'census:08', label: 'Colorado' },
  { type: 'STATE', value: 'Connecticut',    placeId: 'census:09', label: 'Connecticut' },
  { type: 'STATE', value: 'Delaware',       placeId: 'census:10', label: 'Delaware' },
  { type: 'STATE', value: 'Florida',        placeId: 'census:12', label: 'Florida' },
  { type: 'STATE', value: 'Georgia',        placeId: 'census:13', label: 'Georgia' },
  { type: 'STATE', value: 'Hawaii',         placeId: 'census:15', label: 'Hawaii' },
  { type: 'STATE', value: 'Idaho',          placeId: 'census:16', label: 'Idaho' },
  { type: 'STATE', value: 'Illinois',       placeId: 'census:17', label: 'Illinois' },
  { type: 'STATE', value: 'Indiana',        placeId: 'census:18', label: 'Indiana' },
  { type: 'STATE', value: 'Iowa',           placeId: 'census:19', label: 'Iowa' },
  { type: 'STATE', value: 'Kansas',         placeId: 'census:20', label: 'Kansas' },
  { type: 'STATE', value: 'Kentucky',       placeId: 'census:21', label: 'Kentucky' },
  { type: 'STATE', value: 'Louisiana',      placeId: 'census:22', label: 'Louisiana' },
  { type: 'STATE', value: 'Maine',          placeId: 'census:23', label: 'Maine' },
  { type: 'STATE', value: 'Maryland',       placeId: 'census:24', label: 'Maryland' },
  { type: 'STATE', value: 'Massachusetts',  placeId: 'census:25', label: 'Massachusetts' },
  { type: 'STATE', value: 'Michigan',       placeId: 'census:26', label: 'Michigan' },
  { type: 'STATE', value: 'Minnesota',      placeId: 'census:27', label: 'Minnesota' },
  { type: 'STATE', value: 'Mississippi',    placeId: 'census:28', label: 'Mississippi' },
  { type: 'STATE', value: 'Missouri',       placeId: 'census:29', label: 'Missouri' },
  { type: 'STATE', value: 'Montana',        placeId: 'census:30', label: 'Montana' },
  { type: 'STATE', value: 'Nebraska',       placeId: 'census:31', label: 'Nebraska' },
  { type: 'STATE', value: 'Nevada',         placeId: 'census:32', label: 'Nevada' },
  { type: 'STATE', value: 'New Hampshire',  placeId: 'census:33', label: 'New Hampshire' },
  { type: 'STATE', value: 'New Jersey',     placeId: 'census:34', label: 'New Jersey' },
  { type: 'STATE', value: 'New Mexico',     placeId: 'census:35', label: 'New Mexico' },
  { type: 'STATE', value: 'New York',       placeId: 'census:36', label: 'New York' },
  { type: 'STATE', value: 'North Carolina', placeId: 'census:37', label: 'North Carolina' },
  { type: 'STATE', value: 'North Dakota',   placeId: 'census:38', label: 'North Dakota' },
  { type: 'STATE', value: 'Ohio',           placeId: 'census:39', label: 'Ohio' },
  { type: 'STATE', value: 'Oklahoma',       placeId: 'census:40', label: 'Oklahoma' },
  { type: 'STATE', value: 'Oregon',         placeId: 'census:41', label: 'Oregon' },
  { type: 'STATE', value: 'Pennsylvania',   placeId: 'census:42', label: 'Pennsylvania' },
  { type: 'STATE', value: 'Rhode Island',   placeId: 'census:44', label: 'Rhode Island' },
  { type: 'STATE', value: 'South Carolina', placeId: 'census:45', label: 'South Carolina' },
  { type: 'STATE', value: 'South Dakota',   placeId: 'census:46', label: 'South Dakota' },
  { type: 'STATE', value: 'Tennessee',      placeId: 'census:47', label: 'Tennessee' },
  { type: 'STATE', value: 'Texas',          placeId: 'census:48', label: 'Texas' },
  { type: 'STATE', value: 'Utah',           placeId: 'census:49', label: 'Utah' },
  { type: 'STATE', value: 'Vermont',        placeId: 'census:50', label: 'Vermont' },
  { type: 'STATE', value: 'Virginia',       placeId: 'census:51', label: 'Virginia' },
  { type: 'STATE', value: 'Washington',     placeId: 'census:53', label: 'Washington' },
  { type: 'STATE', value: 'West Virginia',  placeId: 'census:54', label: 'West Virginia' },
  { type: 'STATE', value: 'Wisconsin',      placeId: 'census:55', label: 'Wisconsin' },
  { type: 'STATE', value: 'Wyoming',        placeId: 'census:56', label: 'Wyoming' },
  { type: 'STATE', value: 'District of Columbia', placeId: 'census:11', label: 'District of Columbia' },
]

// ---------------------------------------------------------------------------
// COUNTRIES — ISO 3166-1 alpha-2 codes
// ---------------------------------------------------------------------------
const countries: AreaOption[] = [
  { type: 'COUNTRY', value: 'United States',   placeId: 'iso:US', label: 'United States' },
  { type: 'COUNTRY', value: 'Canada',          placeId: 'iso:CA', label: 'Canada' },
  { type: 'COUNTRY', value: 'Mexico',          placeId: 'iso:MX', label: 'Mexico' },
  { type: 'COUNTRY', value: 'United Kingdom',  placeId: 'iso:GB', label: 'United Kingdom' },
  { type: 'COUNTRY', value: 'Australia',       placeId: 'iso:AU', label: 'Australia' },
  { type: 'COUNTRY', value: 'Germany',         placeId: 'iso:DE', label: 'Germany' },
  { type: 'COUNTRY', value: 'France',          placeId: 'iso:FR', label: 'France' },
  { type: 'COUNTRY', value: 'Japan',           placeId: 'iso:JP', label: 'Japan' },
  { type: 'COUNTRY', value: 'Brazil',          placeId: 'iso:BR', label: 'Brazil' },
  { type: 'COUNTRY', value: 'India',           placeId: 'iso:IN', label: 'India' },
  { type: 'COUNTRY', value: 'South Africa',    placeId: 'iso:ZA', label: 'South Africa' },
  { type: 'COUNTRY', value: 'Kenya',           placeId: 'iso:KE', label: 'Kenya' },
  { type: 'COUNTRY', value: 'Nigeria',         placeId: 'iso:NG', label: 'Nigeria' },
  { type: 'COUNTRY', value: 'Philippines',     placeId: 'iso:PH', label: 'Philippines' },
  { type: 'COUNTRY', value: 'Haiti',           placeId: 'iso:HT', label: 'Haiti' },
  { type: 'COUNTRY', value: 'Guatemala',       placeId: 'iso:GT', label: 'Guatemala' },
  { type: 'COUNTRY', value: 'Honduras',        placeId: 'iso:HN', label: 'Honduras' },
]

// ---------------------------------------------------------------------------
// Combined export — ordered by type for grouped display
// ---------------------------------------------------------------------------
export const SERVICE_AREA_OPTIONS: AreaOption[] = [
  ...neighborhoods,
  ...cities,
  ...counties,
  ...states,
  ...countries,
]

// Helpers
export const SERVICE_AREA_BY_TYPE: Record<AreaType, AreaOption[]> = {
  NEIGHBORHOOD: neighborhoods,
  CITY: cities,
  COUNTY: counties,
  STATE: states,
  COUNTRY: countries,
}

export const AREA_TYPE_LABELS: Record<AreaType, string> = {
  NEIGHBORHOOD: 'Neighborhood',
  CITY: 'City',
  COUNTY: 'County',
  STATE: 'State',
  COUNTRY: 'Country',
}