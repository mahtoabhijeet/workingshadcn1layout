export interface Article {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  treks: Trek[];
}

export interface Media {
  id: string;
  type: 'photo' | 'video' | 'note';
  url: string;
  thumbnailUrl: string;
  title: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content?: string; // For notes
}

export interface Waypoint {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  media: {
    photos: Media[];
    videos: Media[];
    notes: Media[];
  };
}

export interface Trek {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  coordinates: [number, number]; // [longitude, latitude]
  details: {
    duration: string;
    distance: string;
    elevation: string;
    bestSeason: string;
    startingPoint: string;
    permitsRequired: boolean;
    emergencyContact: string;
  };
  interactive: {
    photoGallery: string[];
    weatherForecast: WeatherData;
    bookingLinks: BookingLink[];
    similarTreks: string[];
    reviews: Review[];
  };
  waypoints: Waypoint[];
}

export interface BookingLink {
  provider: string;
  url: string;
  price?: string;
}

export interface Review {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface WeatherData {
  temperature: {
    min: number;
    max: number;
    unit: string;
  };
  conditions: string;
  windSpeed: {
    value: number;
    unit: string;
  };
  precipitation: {
    chance: number;
    unit: string;
  };
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'article-1',
    title: 'Manali Trekking Guide: Easy Trails',
    description: 'Explore the most accessible and beautiful treks around Manali, perfect for beginners.',
    coverImage: '/images/manali-easy.jpg',
    treks: [
      {
        id: 'trek-1-1',
        name: 'Jogini Waterfall Trek',
        difficulty: 'Easy',
        coordinates: [77.1700, 32.2550],
        details: {
          duration: '2-3 hours',
          distance: '3 km',
          elevation: '200m gain',
          bestSeason: 'March to October',
          startingPoint: 'Vashisht Village',
          permitsRequired: false,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/jogini-1.jpg', '/images/jogini-2.jpg'],
          weatherForecast: { temperature: { min: 10, max: 20, unit: 'C' }, conditions: 'Sunny', windSpeed: { value: 5, unit: 'km/h' }, precipitation: { chance: 10, unit: '%' } },
          bookingLinks: [{ provider: 'Local Guide', url: '#', price: '₹500' }],
          similarTreks: ['trek-1-2'],
          reviews: [{ rating: 5, comment: 'Beautiful and refreshing!', author: 'Anjali S.', date: '2023-05-10' }],
        },
        waypoints: [
          {
            id: 'wp-1',
            name: 'Starting Point',
            description: 'The trek starts from the Vashisht temple.',
            coordinates: [77.1700, 32.2550],
            media: {
              photos: [
                { id: 'p1', type: 'photo', url: '/images/vashisht-temple.jpg', thumbnailUrl: '/images/vashisht-temple-thumb.jpg', title: 'Vashisht Temple', author: { name: 'Rajesh', avatarUrl: '/avatars/rajesh.png' } },
              ],
              videos: [],
              notes: [
                { id: 'n1', type: 'note', url: '', thumbnailUrl: '', title: 'Early Start', author: { name: 'Priya', avatarUrl: '/avatars/priya.png' }, content: 'Best to start early to avoid the afternoon sun.' },
              ],
            },
          },
          {
            id: 'wp-2',
            name: 'Jogini Waterfall',
            description: 'The main attraction of the trek.',
            coordinates: [77.1650, 32.2600],
            media: {
              photos: [
                { id: 'p2', type: 'photo', url: '/images/jogini-falls.jpg', thumbnailUrl: '/images/jogini-falls-thumb.jpg', title: 'The Majestic Waterfall', author: { name: 'Amit', avatarUrl: '/avatars/amit.png' } },
              ],
              videos: [
                { id: 'v1', type: 'video', url: '/videos/jogini-flow.mp4', thumbnailUrl: '/videos/jogini-flow-thumb.jpg', title: 'Waterfall in action', author: { name: 'Sunita', avatarUrl: '/avatars/sunita.png' } },
              ],
              notes: [],
            },
          },
        ]
      },
      {
        id: 'trek-1-2',
        name: 'Hadimba Devi Temple Walk',
        difficulty: 'Easy',
        coordinates: [77.1800, 32.2450],
        details: {
          duration: '1-2 hours',
          distance: '1.5 km',
          elevation: '50m gain',
          bestSeason: 'All year',
          startingPoint: 'Manali Town',
          permitsRequired: false,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/hadimba-1.jpg', '/images/hadimba-2.jpg'],
          weatherForecast: { temperature: { min: 12, max: 22, unit: 'C' }, conditions: 'Partly Cloudy', windSpeed: { value: 7, unit: 'km/h' }, precipitation: { chance: 5, unit: '%' } },
          bookingLinks: [],
          similarTreks: ['trek-1-1'],
          reviews: [{ rating: 4, comment: 'Nice cultural walk.', author: 'Rahul K.', date: '2023-06-15' }],
        },
        waypoints: [],
      },
    ],
  },
  {
    id: 'article-2',
    title: 'Moderate Treks in Manali Region',
    description: 'For those seeking a bit more challenge, these trails offer stunning views and rewarding experiences.',
    coverImage: '/images/manali-moderate.jpg',
    treks: [
      {
        id: 'trek-2-1',
        name: 'Beas Kund Trek',
        difficulty: 'Moderate',
        coordinates: [77.1000, 32.3500],
        details: {
          duration: '3 days',
          distance: '15 km',
          elevation: '1000m gain',
          bestSeason: 'May to October',
          startingPoint: 'Solang Valley',
          permitsRequired: true,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/beaskund-1.jpg', '/images/beaskund-2.jpg'],
          weatherForecast: { temperature: { min: 5, max: 15, unit: 'C' }, conditions: 'Cloudy', windSpeed: { value: 15, unit: 'km/h' }, precipitation: { chance: 30, unit: '%' } },
          bookingLinks: [{ provider: 'Trek India', url: '#', price: '₹5000' }],
          similarTreks: ['trek-2-2'],
          reviews: [{ rating: 5, comment: 'Challenging but worth it!', author: 'Priya M.', date: '2023-07-20' }],
        },
        waypoints: [],
      },
      {
        id: 'trek-2-2',
        name: 'Bhrigu Lake Trek',
        difficulty: 'Moderate',
        coordinates: [77.2500, 32.2000],
        details: {
          duration: '2 days',
          distance: '10 km',
          elevation: '800m gain',
          bestSeason: 'June to September',
          startingPoint: 'Gulaba',
          permitsRequired: true,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/bhrigu-1.jpg', '/images/bhrigu-2.jpg'],
          weatherForecast: { temperature: { min: 7, max: 18, unit: 'C' }, conditions: 'Rainy', windSpeed: { value: 10, unit: 'km/h' }, precipitation: { chance: 50, unit: '%' } },
          bookingLinks: [{ provider: 'Himalayan Treks', url: '#', price: '₹4000' }],
          similarTreks: ['trek-2-1'],
          reviews: [{ rating: 4, comment: 'Stunning lake, tough climb.', author: 'Vikram S.', date: '2023-08-01' }],
        },
        waypoints: [],
      },
    ],
  },
  {
    id: 'article-3',
    title: 'Challenging Expeditions from Manali',
    description: 'For experienced trekkers, these expeditions push your limits and offer unparalleled adventure.',
    coverImage: '/images/manali-hard.jpg',
    treks: [
      {
        id: 'trek-3-1',
        name: 'Hampta Pass Trek',
        difficulty: 'Hard',
        coordinates: [77.4000, 32.2000],
        details: {
          duration: '5 days',
          distance: '26 km',
          elevation: '1500m gain',
          bestSeason: 'June to October',
          startingPoint: 'Jobra',
          permitsRequired: true,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/hampta-1.jpg', '/images/hampta-2.jpg'],
          weatherForecast: { temperature: { min: 0, max: 10, unit: 'C' }, conditions: 'Snowy', windSpeed: { value: 20, unit: 'km/h' }, precipitation: { chance: 70, unit: '%' } },
          bookingLinks: [{ provider: 'India Hikes', url: '#', price: '₹10000' }],
          similarTreks: ['trek-3-2'],
          reviews: [{ rating: 5, comment: 'An unforgettable adventure!', author: 'Deepak R.', date: '2023-09-05' }],
        },
        waypoints: [],
      },
      {
        id: 'trek-3-2',
        name: 'Pin Parvati Pass Trek',
        difficulty: 'Hard',
        coordinates: [77.7000, 31.9000],
        details: {
          duration: '11 days',
          distance: '100 km',
          elevation: '2500m gain',
          bestSeason: 'July to September',
          startingPoint: 'Barshaini',
          permitsRequired: true,
          emergencyContact: '+91 9876543210',
        },
        interactive: {
          photoGallery: ['/images/pinparvati-1.jpg', '/images/pinparvati-2.jpg'],
          weatherForecast: { temperature: { min: -5, max: 5, unit: 'C' }, conditions: 'Blizzard', windSpeed: { value: 30, unit: 'km/h' }, precipitation: { chance: 90, unit: '%' } },
          bookingLinks: [{ provider: 'Trek The Himalayas', url: '#', price: '₹20000' }],
          similarTreks: ['trek-3-1'],
          reviews: [{ rating: 5, comment: 'The ultimate challenge!', author: 'Sonia D.', date: '2023-10-10' }],
        },
        waypoints: [],
      },
    ],
  },
];
