/* =============================================
   GEMSOUL — DATA LAYER
   ============================================= */

let GEMSTONE_DATA = [];

const ZODIAC_DATA = [
  {
    name: 'Aries', symbol: '♈', emoji: '🐏', dateRange: 'Mar 21 – Apr 19', element: 'Fire', elementEmoji: '🔥', planet: 'Mars',
    traits: ['Bold', 'Courageous', 'Energetic', 'Impulsive'],
    description: 'Aries is the first sign of the zodiac, representing new beginnings and raw energy. Arians are natural-born leaders with an unstoppable drive.',
    luckyColors: ['#e53e3e', '#ed8936', '#f6e05e'], wheelColor: '#e53e3e', angle: 90
  },
  {
    name: 'Taurus', symbol: '♉', emoji: '🐂', dateRange: 'Apr 20 – May 20', element: 'Earth', elementEmoji: '🌿', planet: 'Venus',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted'],
    description: 'Taurus values security, beauty, and comfort. Steadfast and dependable, they bring stability and grace wherever they go.',
    luckyColors: ['#38a169', '#48bb78', '#9ae6b4'], wheelColor: '#38a169', angle: 120
  },
  {
    name: 'Gemini', symbol: '♊', emoji: '👯', dateRange: 'May 21 – Jun 20', element: 'Air', elementEmoji: '💨', planet: 'Mercury',
    traits: ['Curious', 'Versatile', 'Witty', 'Communicative'],
    description: 'Gemini is the sign of duality and intellectual curiosity. Quick-witted and adaptable, they can see both sides of every story.',
    luckyColors: ['#ecc94b', '#f6e05e', '#bee3f8'], wheelColor: '#ecc94b', angle: 150
  },
  {
    name: 'Cancer', symbol: '♋', emoji: '🦀', dateRange: 'Jun 21 – Jul 22', element: 'Water', elementEmoji: '💧', planet: 'Moon',
    traits: ['Nurturing', 'Intuitive', 'Loyal', 'Protective'],
    description: 'Cancer is deeply intuitive and sentimental. They are the great caretakers of the zodiac, with a strong sense of home and family.',
    luckyColors: ['#90cdf4', '#bee3f8', '#e9d8fd'], wheelColor: '#4299e1', angle: 180
  },
  {
    name: 'Leo', symbol: '♌', emoji: '🦁', dateRange: 'Jul 23 – Aug 22', element: 'Fire', elementEmoji: '🔥', planet: 'Sun',
    traits: ['Confident', 'Creative', 'Leader', 'Dramatic'],
    description: 'Leo is the royalty of the zodiac — bold, dramatic, and magnetic. They command every room they enter and inspire greatness in others.',
    luckyColors: ['#f6ad55', '#ed8936', '#fbd38d'], wheelColor: '#ed8936', angle: 210
  },
  {
    name: 'Virgo', symbol: '♍', emoji: '👰', dateRange: 'Aug 23 – Sep 22', element: 'Earth', elementEmoji: '🌿', planet: 'Mercury',
    traits: ['Analytical', 'Precise', 'Helpful', "Diligent"],
    description: 'Virgo seeks perfection through careful analysis and practical service. Their attention to detail and dedication makes them invaluable.',
    luckyColors: ['#68d391', '#9ae6b4', '#f0fff4'], wheelColor: '#68d391', angle: 240
  },
  {
    name: 'Libra', symbol: '♎', emoji: '⚖️', dateRange: 'Sep 23 – Oct 22', element: 'Air', elementEmoji: '💨', planet: 'Venus',
    traits: ['Balanced', 'Diplomatic', 'Gracious', 'Social'],
    description: 'Libra seeks balance, beauty, and justice. They are natural diplomats who strive for harmony in all aspects of life.',
    luckyColors: ['#f687b3', '#fbb6ce', '#bee3f8'], wheelColor: '#f687b3', angle: 270
  },
  {
    name: 'Scorpio', symbol: '♏', emoji: '🦂', dateRange: 'Oct 23 – Nov 21', element: 'Water', elementEmoji: '💧', planet: 'Pluto',
    traits: ['Intense', 'Mysterious', 'Passionate', 'Perceptive'],
    description: 'Scorpio is the sign of transformation and depth. Their magnetic intensity and keen perception pierce through every illusion.',
    luckyColors: ['#702459', '#b7791f', '#1a202c'], wheelColor: '#9b2335', angle: 300
  },
  {
    name: 'Sagittarius', symbol: '♐', emoji: '🏹', dateRange: 'Nov 22 – Dec 21', element: 'Fire', elementEmoji: '🔥', planet: 'Jupiter',
    traits: ['Adventurous', 'Optimistic', 'Honest', 'Philosophical'],
    description: 'Sagittarius is the eternal seeker — chasing wisdom, adventure, and freedom across all of life\'s horizons.',
    luckyColors: ['#f6ad55', '#63b3ed', '#48bb78'], wheelColor: '#f6ad55', angle: 330
  },
  {
    name: 'Capricorn', symbol: '♑', emoji: '🐐', dateRange: 'Dec 22 – Jan 19', element: 'Earth', elementEmoji: '🌿', planet: 'Saturn',
    traits: ['Disciplined', 'Responsible', 'Ambitious', 'Practical'],
    description: 'Capricorn is the master builder of the zodiac. Their discipline and ambition allow them to climb any mountain and achieve lasting success.',
    luckyColors: ['#718096', '#4a5568', '#2d3748'], wheelColor: '#718096', angle: 0
  },
  {
    name: 'Aquarius', symbol: '♒', emoji: '🏺', dateRange: 'Jan 20 – Feb 18', element: 'Air', elementEmoji: '💨', planet: 'Uranus',
    traits: ['Progressive', 'Original', 'Humanitarian', 'Independent'],
    description: 'Aquarius is the visionary rebel — unconventional, forward-thinking, and deeply committed to the betterment of humanity.',
    luckyColors: ['#63b3ed', '#90cdf4', '#bee3f8'], wheelColor: '#63b3ed', angle: 30
  },
  {
    name: 'Pisces', symbol: '♓', emoji: '🐟', dateRange: 'Feb 19 – Mar 20', element: 'Water', elementEmoji: '💧', planet: 'Neptune',
    traits: ['Empathetic', 'Artistic', 'Gentle', 'Wise'],
    description: 'Pisces is the dreamer of the zodiac — compassionate, mystical, and deeply connected to the spiritual realm and universal love.',
    luckyColors: ['#9f7aea', '#b794f4', '#e9d8fd'], wheelColor: '#9f7aea', angle: 60
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "I was skeptical at first, but after wearing the Ruby recommended for my Aries sign, my career completely transformed within three months. I got promoted twice!",
    name: 'Priya Sharma', sign: 'Aries ♈', avatar: '🌟', stars: 5,
  },
  {
    quote: "The Emerald recommendation was so accurate for a Taurus like me. I've found such peace in my relationships, and my creativity has skyrocketed.",
    name: 'Lucas Mendez', sign: 'Taurus ♉', avatar: '💎', stars: 5,
  },
  {
    quote: "GemSoul's zodiac wheel is stunning! I spent an hour exploring it. The Amethyst recommendation was perfect for my anxiety — I sleep so much better now.",
    name: 'Aisha Patel', sign: 'Aquarius ♒', avatar: '🔮', stars: 5,
  },
  {
    quote: "As a Capricorn, I needed something grounding. The Garnet has made me more disciplined and focused. My business revenue increased by 40% this quarter.",
    name: 'James Wu', sign: 'Capricorn ♑', avatar: '✨', stars: 5,
  },
  {
    quote: "The cosmic experience of GemSoul is unlike anything I've seen. The zodiac explorer made me understand my Pisces energy in such a beautiful, visual way.",
    name: 'Sofia Bellini', sign: 'Pisces ♓', avatar: '🌙', stars: 5,
  },
  {
    quote: "I bought the Blue Sapphire for my Virgo energy and it's been transformational. My focus is incredible and my studies have never gone better.",
    name: 'Rahul Nair', sign: 'Virgo ♍', avatar: '🦋', stars: 5,
  }
];

async function loadData() {
    try {
        GEMSTONE_DATA = await api.getGemstones();
        if (typeof initGemstoneLibrary === 'function') {
            initGemstoneLibrary();
        }
    } catch (err) {
        console.error("Failed to load gemstones", err);
    }
}
