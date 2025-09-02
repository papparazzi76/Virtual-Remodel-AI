import { DecorStyle, Material, Lighting, RoomType } from './types';

interface DecorStyleOption {
  value: DecorStyle;
  labelKey: string;
  visual: string;
}

export const DECOR_STYLES: DecorStyleOption[] = [
  { value: 'Modern', labelKey: 'decorStyleLabels.modern', visual: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Contemporary', labelKey: 'decorStyleLabels.contemporary', visual: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Minimalist', labelKey: 'decorStyleLabels.minimalist', visual: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Scandinavian', labelKey: 'decorStyleLabels.scandinavian', visual: 'https://images.pexels.com/photos/6438762/pexels-photo-6438762.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Rustic', labelKey: 'decorStyleLabels.rustic', visual: 'https://images.pexels.com/photos/683929/pexels-photo-683929.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Industrial', labelKey: 'decorStyleLabels.industrial', visual: 'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Boho Chic', labelKey: 'decorStyleLabels.bohoChic', visual: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Modern Luxury', labelKey: 'decorStyleLabels.modernLuxury', visual: 'https://images.pexels.com/photos/6580225/pexels-photo-6580225.jpeg?auto=compress&cs=tinysrgb&w=160' },
  { value: 'Classic Luxury', labelKey: 'decorStyleLabels.classicLuxury', visual: 'https://images.pexels.com/photos/6782476/pexels-photo-6782476.jpeg?auto=compress&cs=tinysrgb&w=160' },
];

interface MaterialOption {
  value: Material;
  labelKey: string;
}

export const MATERIALS: MaterialOption[] = [
  { value: 'White Paint', labelKey: 'materialLabels.whitePaint' },
  { value: 'Light Wood', labelKey: 'materialLabels.lightWood' },
  { value: 'Dark Wood', labelKey: 'materialLabels.darkWood' },
  { value: 'Polished Concrete', labelKey: 'materialLabels.polishedConcrete' },
  { value: 'Marble Tile', labelKey: 'materialLabels.marbleTile' },
  { value: 'Exposed Brick', labelKey: 'materialLabels.exposedBrick' },
  { value: 'Modern Tile', labelKey: 'materialLabels.modernTile' },
];

interface LightingOption {
  value: Lighting;
  labelKey: string;
}

export const LIGHTING_OPTIONS: LightingOption[] = [
  { value: 'Bright & Airy', labelKey: 'lightingLabels.brightAiry' },
  { value: 'Warm & Cozy', labelKey: 'lightingLabels.warmCozy' },
  { value: 'Cool & Modern', labelKey: 'lightingLabels.coolModern' },
  { value: 'Dramatic & Dim', labelKey: 'lightingLabels.dramaticDim' },
];

interface RoomTypeOption {
  value: RoomType;
  labelKey: string;
}

export const ROOM_TYPES: RoomTypeOption[] = [
  { value: 'Master Bedroom', labelKey: 'roomTypeLabels.masterBedroom' },
  { value: 'Single Bedroom', labelKey: 'roomTypeLabels.singleBedroom' },
  { value: 'Youth Bedroom', labelKey: 'roomTypeLabels.youthBedroom' },
  { value: 'Powder Room', labelKey: 'roomTypeLabels.powderRoom' },
  { value: 'Full Bathroom', labelKey: 'roomTypeLabels.fullBathroom' },
  { value: 'Kitchen', labelKey: 'roomTypeLabels.kitchen' },
  { value: 'Living Room', labelKey: 'roomTypeLabels.livingRoom' },
  { value: 'Family Room', labelKey: 'roomTypeLabels.familyRoom' },
  { value: 'Terrace', labelKey: 'roomTypeLabels.terrace' },
  { value: 'Garden', labelKey: 'roomTypeLabels.garden' },
  { value: 'Garage', labelKey: 'roomTypeLabels.garage' },
];

// Sourced from Pexels, which offers royalty-free images.
export const SAMPLE_IMAGES = [
  {
    id: 'living-room',
    labelKey: 'samples.livingRoom',
    src: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'bedroom',
    labelKey: 'samples.bedroom',
    src: 'https://images.pexels.com/photos/376531/pexels-photo-376531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'kitchen',
    labelKey: 'samples.kitchen',
    src: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
] as const;


export const LANDING_PAGE_SAMPLES = [
  {
    id: 'living-room',
    labelKey: 'samples.livingRoom',
    beforeSrc: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    afterSrc: 'https://images.pexels.com/photos/6585626/pexels-photo-6585626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'bedroom',
    labelKey: 'samples.bedroom',
    beforeSrc: 'https://images.pexels.com/photos/376531/pexels-photo-376531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    afterSrc: 'https://images.pexels.com/photos/6438762/pexels-photo-6438762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'bathroom',
    labelKey: 'samples.bathroom',
    beforeSrc: 'https://images.pexels.com/photos/1080722/pexels-photo-1080722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    afterSrc: 'https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'kitchen',
    labelKey: 'samples.kitchen',
    beforeSrc: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    afterSrc: 'https://images.pexels.com/photos/3074920/pexels-photo-3074920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  }
] as const;


export const PRICING_PLANS = [
    { id: 'individual', nameKey: 'pricing.individualPlanName', creditsKey: 'pricing.individualPlanCredits', priceUSD: 20, credits: 100, featuresKey: 'pricing.individualPlanFeatures', ctaKey: 'pricing.getStartedButton', isPopular: false, ctaAction: 'purchase' as const },
    { id: 'agency', nameKey: 'pricing.agencyPlanName', creditsKey: 'pricing.agencyPlanCredits', priceUSD: 53, credits: 500, featuresKey: 'pricing.agencyPlanFeatures', ctaKey: 'pricing.getStartedButton', isPopular: true, ctaAction: 'purchase' as const },
    { id: 'enterprise', nameKey: 'pricing.enterprisePlanName', creditsKey: 'pricing.enterprisePlanCredits', priceUSD: null, credits: 0, featuresKey: 'pricing.enterprisePlanFeatures', ctaKey: 'pricing.contactUsButton', isPopular: false, ctaAction: 'contact' as const }
];