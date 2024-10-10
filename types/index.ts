export interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  pickupLocation: string;
  pickupTime: string;
  tripDays: number;
  tripNights: number;
  inclusions: string[];
  itinerary: string[];
  headerImage: string;
  galleryImages: string[];
  totalPeople: number;
  groupType?: 'all' | 'male_only' | 'female_only' | 'couple_only';
}