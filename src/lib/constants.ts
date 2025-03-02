export const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Lawyer',
  'Business Owner',
  'Teacher',
  'Architect',
  'Financial Advisor',
  'Chef',
  'Pilot',
  'Nurse',
  'Dentist',
  'Pharmacist',
  'Real Estate Agent',
  'Graphic Designer',
  'Other'
] as const;

// Investment track definitions with complete information
export const INVESTMENT_TRACKS = [
  { 
    id: 'SPY500', 
    name: 'S&P 500 Index Fund', 
    type: 'ETF',
    description: 'Tracks the S&P 500 index of large-cap U.S. stocks',
    benchmark: 'S&P 500 Index',
    expenseRatio: '0.09%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financials, Consumer Discretionary'
  },
  { 
    id: 'VTI', 
    name: 'Vanguard Total Stock Market ETF', 
    type: 'ETF',
    description: 'Provides broad exposure to the entire U.S. stock market',
    benchmark: 'CRSP US Total Market Index',
    expenseRatio: '0.03%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financials, Consumer Discretionary, Industrials'
  },
  { 
    id: 'NASDAQ100', 
    name: 'NASDAQ 100 Index', 
    type: 'ETF',
    description: 'Tracks 100 of the largest non-financial companies listed on the Nasdaq',
    benchmark: 'NASDAQ-100 Index',
    expenseRatio: '0.20%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Tesla',
    sectors: 'Technology, Consumer Services, Healthcare, Consumer Goods'
  }
] as const;

// Historical returns data
export const SP500_RETURNS = [
  0.0348, -0.0250, 0.0573, -0.0099, 0.0202, 0.0228, 0.0113, 0.0347, 0.0480, -0.0416,
  0.0310, 0.0517, 0.0159, 0.0442, 0.0892, -0.0220, -0.0487, -0.0177, 0.0311, 0.0647
];

export const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659
];

// Name generation utilities
const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
];

export const generateRandomName = () => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};