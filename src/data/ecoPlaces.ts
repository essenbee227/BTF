export type EcoLevel = 'high' | 'medium' | 'low';

export type EcoPlaceType = 'hotel' | 'attraction' | 'water' | 'district';

export interface EcoPlace {
  id: string;
  name: string;
  type: EcoPlaceType;
  ecoLevel: EcoLevel;
  coordinates: [number, number]; // [lat, lng]
  description?: string;
}

export const ecoPlaces: EcoPlace[] = [
  {
    id: '1',
    name: 'The Sustainable City',
    type: 'district',
    coordinates: [25.0588, 55.2348],
    ecoLevel: 'high',
    description: 'A net-zero energy development in Dubai'
  },
  {
    id: '2',
    name: 'Al Qudra Lakes',
    type: 'attraction',
    coordinates: [24.8044, 55.3725],
    ecoLevel: 'high',
    description: 'Man-made desert lakes with wildlife'
  },
  {
    id: '3',
    name: 'The Green Planet',
    type: 'attraction',
    coordinates: [25.1185, 55.2017],
    ecoLevel: 'medium'
  },
  {
    id: '4',
    name: 'JW Marriott Marquis',
    type: 'hotel',
    coordinates: [25.2119, 55.2790],
    ecoLevel: 'medium'
  },
  {
    id: '5',
    name: 'Dubai Marina',
    type: 'district',
    coordinates: [25.0763, 55.1328],
    ecoLevel: 'low'
  },
  {
    id: '6',
    name: 'Water Refill Station - City Walk',
    type: 'water',
    coordinates: [25.1972, 55.2620],
    ecoLevel: 'high'
  }
];