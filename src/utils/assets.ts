// Generated 3D & Brand Assets for EA SPORTS FC 26/27
import fcBrandLogo from '../assets/images/fc_brand_logo_1789999972606.jpg';
import stadiumMatchday3D from '../assets/images/stadium_matchday_3d_1789999988437.jpg';
import goldenTrophy3D from '../assets/images/golden_trophy_3d_1790000001385.jpg';
import superstarRender3D from '../assets/images/superstar_render_3d_1790000016443.jpg';

export const ASSETS_3D = {
  fcBrandLogo,
  stadiumMatchday3D,
  goldenTrophy3D,
  superstarRender3D,
};

// Verified high-res SVG & official club crest logos for world football clubs
export const CLUB_CRESTS: Record<string, { logo: string; primaryColor: string; secondaryColor: string; short: string }> = {
  'Real Madrid': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    primaryColor: '#ffffff',
    secondaryColor: '#febe10',
    short: 'RMA',
  },
  'FC Barcelona': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    primaryColor: '#a50044',
    secondaryColor: '#004d98',
    short: 'FCB',
  },
  'Manchester City': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    primaryColor: '#6cabdd',
    secondaryColor: '#1c2c5b',
    short: 'MCI',
  },
  'Arsenal': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    primaryColor: '#ef0107',
    secondaryColor: '#ffffff',
    short: 'ARS',
  },
  'Liverpool': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    primaryColor: '#c8102e',
    secondaryColor: '#00b2a9',
    short: 'LIV',
  },
  'Manchester United': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
    primaryColor: '#da291c',
    secondaryColor: '#ffe500',
    short: 'MUN',
  },
  'Chelsea': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    primaryColor: '#034694',
    secondaryColor: '#dba111',
    short: 'CHE',
  },
  'Bayern Munich': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    primaryColor: '#dc052d',
    secondaryColor: '#0066b2',
    short: 'BAY',
  },
  'Paris Saint-Germain': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
    primaryColor: '#004170',
    secondaryColor: '#da291c',
    short: 'PSG',
  },
  'Inter Milan': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    primaryColor: '#010e9b',
    secondaryColor: '#000000',
    short: 'INT',
  },
  'AC Milan': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
    primaryColor: '#fb090b',
    secondaryColor: '#000000',
    short: 'ACM',
  },
  'Juventus': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    short: 'JUV',
  },
  'Atletico Madrid': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
    primaryColor: '#cb3524',
    secondaryColor: '#272e61',
    short: 'ATM',
  },
  'Borussia Dortmund': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
    primaryColor: '#fde100',
    secondaryColor: '#000000',
    short: 'BVB',
  },
  'Bayer Leverkusen': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
    primaryColor: '#e32221',
    secondaryColor: '#000000',
    short: 'B04',
  },
  'Tottenham Hotspur': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
    primaryColor: '#132257',
    secondaryColor: '#ffffff',
    short: 'TOT',
  },
  'Aston Villa': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
    primaryColor: '#95bfe5',
    secondaryColor: '#670e36',
    short: 'AVL',
  },
  'Newcastle United': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
    primaryColor: '#241f20',
    secondaryColor: '#41b6e6',
    short: 'NEW',
  },
  'Sporting CP': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo%29.svg',
    primaryColor: '#006633',
    secondaryColor: '#ffffff',
    short: 'SCP',
  },
  'Benfica': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg',
    primaryColor: '#ff0000',
    secondaryColor: '#ffffff',
    short: 'SLB',
  },
  'Ajax': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg',
    primaryColor: '#d2122e',
    secondaryColor: '#ffffff',
    short: 'AJX',
  },
};

/**
 * Returns authentic club crest data or generates an FC styled geometric badge
 */
export function getClubDetails(clubName?: string) {
  if (!clubName) {
    return {
      name: 'Unknown FC',
      short: 'UFC',
      logo: null,
      primaryColor: '#10b981',
      secondaryColor: '#047857',
    };
  }

  // Exact or partial match
  const exact = CLUB_CRESTS[clubName];
  if (exact) {
    return {
      name: clubName,
      ...exact,
    };
  }

  const foundKey = Object.keys(CLUB_CRESTS).find((k) =>
    clubName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clubName.toLowerCase())
  );

  if (foundKey) {
    return {
      name: clubName,
      ...CLUB_CRESTS[foundKey],
    };
  }

  // Generate fallback acronym & colors
  const words = clubName.split(' ').filter(Boolean);
  const short = words.length > 1
    ? words.map(w => w[0]).join('').slice(0, 3).toUpperCase()
    : clubName.slice(0, 3).toUpperCase();

  return {
    name: clubName,
    short,
    logo: null,
    primaryColor: '#00ff87',
    secondaryColor: '#05f1cd',
  };
}

// Player avatar cutout helpers (famous stars or futuristic 3D renders)
export const FAMOUS_PLAYERS_AVATARS: Record<string, string> = {
  'Kylian Mbappé': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
  'Erling Haaland': 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=400&q=80',
  'Jude Bellingham': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
  'Vinicius Jr.': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
  'Bukayo Saka': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
  'Phil Foden': 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80',
  'Lamine Yamal': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
  'Jamal Musiala': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  'Florian Wirtz': 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=400&q=80',
};

export function getPlayerPhoto(name: string, customPhoto?: string, _extra?: string): string {
  if (customPhoto && customPhoto.startsWith('http')) return customPhoto;
  const match = Object.keys(FAMOUS_PLAYERS_AVATARS).find(p =>
    name.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(name.toLowerCase())
  );
  if (match) return FAMOUS_PLAYERS_AVATARS[match];
  // Use high-tech 3D superstar render default
  return ASSETS_3D.superstarRender3D;
}
