export enum B2BStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  UNVERIFIED = 'unverified',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum UserFavoriteType {
  EVENT = 'event',
  ARTIST = 'artist',
  VENUE = 'venue',
  ORGANIZER = 'organizer',
}

export enum UserFavoriteStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export enum SubscriptionType {
  FREE = 'free',
  PER_EVENT = 'per event',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum UserType {
  B2B = 'b2b',
  B2C = 'b2c',
  BOTH = 'both',
}

export enum UserStatus {
  ACTIVE = 'Active',
  UNVERIFIED = 'Unverified',
  DELETED = 'Deleted',
  BLOCKED = 'Blocked',
}

export enum VerificationCodeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VERIFIED = 'verified',
}

export enum FeeType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  TIERED = 'tiered',
}
