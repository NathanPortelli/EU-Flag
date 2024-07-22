export const shapePaths = {
  Star: "M50,0 L61,35 H98 L68,57 L79,91 L50,70 L21,91 L32,57 L2,35 H39 Z",
  Circle: "M50,50m-50,0a50,50 0 1,0 100,0a50,50 0 1,0 -100,0",
  Square: "M0,0 H100 V100 H0 Z",
  Hexagon: "M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 Z",
  Pentagon: "M50,0 L100,38 L81,100 L19,100 L0,38 Z",
  Octagon: "M30,0 H70 L100,30 V70 L70,100 H30 L0,70 V30 Z",
  Diamond: "M50,0 L100,50 L50,100 L0,50 Z",
  Crescent: "M50,0 A50,50 0 0,0 50,100 A25,50 0 1,1 50,0 Z",
  Triangle: "M50,0 L100,100 H0 Z",
  Cross: "M35,0 V35 H0 V65 H35 V100 H65 V65 H100 V35 H65 V0 Z",
  Shield: "M 50 0 L 90 20 Q 95 25 90 50 Q 50 140 10 50 Q 5 25 10 20 Z",
  Heart: "M50 15 C25 -10 0 20 50 50 C100 20 75 -10 50 15 Z",
  Arrow: "M 38 0 L 75 50 H 50 V 100 H 25 V 50 H 0 Z",
  Trapezoid: "M 24 68 H 75 L 100 100 H 0 Z",
  Parallelogram: "M 25 0 H 100 L 75 100 H 0 Z",
  Chevron: "M 25 0 L 75 0 L 50 50 L 75 100 H 25 L 0 50 Z",
};

export const shapeOptions = [
  'Star', 
  'Circle', 
  'Square', 
  'Shield', 
  'Hexagon', 
  'Pentagon', 
  'Octagon', 
  'Diamond', 
  'Crescent', 
  'Triangle', 
  'Cross', 
  'Heart',
  'Arrow',
  'Trapezoid',
  'Parallelogram',
  'Chevron',
];

// export const formatOptions = [
//   'Circle', 
//   'Square', 
// ];

// export const formatIcons = {
//   'Square': '☐',
//   'Circle': '○',
// };

export const patternOptions = [
  'Single', 
  'Horizontal', 
  'Vertical', 
  'Checkered',
  'Bends', 
  'Quadrants', 
  'Cross', 
  'Saltire',
  'Sunburst',
  'Border',
];

export const patternIcons = {
  'Single': '▉',
  'Vertical': '║',
  'Horizontal': '═',
  'Checkered': '▦',
  'Bends': '⫽',
  'Quadrants': '✚',
  'Cross': '╬',
  'Saltire': 'X',
  'Sunburst': '☀',
  'Border': '⬚',
};

export const amountOptions = {
  'Horizontal': [],
  'Vertical': [],
  'Checkered': [],
  'Bends': ['Forwards', 'Backwards', 'Both Ways', 'Forward Stripe', 'Backward Stripe'],
  'Quadrants': [],
  'Saltire': [],
  'Cross': [],
  'Single': [],
  'Sunburst': [],
};

export const amountIcons = {
  'Forwards': '/',
  'Backwards': '\\',
  'Both Ways': '𝕏',
  'Forward Stripe': '⫽',
  'Backward Stripe': '\\\\'
};