import { AgencySchema, AlertSchema, CreateRoleSchema, HashedShapeSchema, HashedTripSchema, MunicipalitySchema, OrganizationSchema, RideSchema, SessionSchema, StopSchema, UpdateAgencySchema, UpdateAlertSchema, UpdateHashedShapeSchema, UpdateHashedTripSchema, UpdateMunicipalitySchema, UpdateOrganizationSchema, UpdateRideSchema, UpdateRoleSchema, UpdateStopSchema, UpdateUserSchema, UpdateZoneSchema, UserSchema, VerificationTokenSchema, ZoneSchema } from '@/types';

export function createSchemaFactory(collectionName: string) {
	switch (collectionName) {
		case 'agencies':
			return [AgencySchema, UpdateAgencySchema];
		case 'alerts':
			return [AlertSchema, UpdateAlertSchema];
		case 'hashed_shapes':
			return [HashedShapeSchema, UpdateHashedShapeSchema];
		case 'hashed_trips':
			return [HashedTripSchema, UpdateHashedTripSchema];
		case 'municipalities':
			return [MunicipalitySchema, UpdateMunicipalitySchema];
		case 'organizations':
			return [OrganizationSchema, UpdateOrganizationSchema];
		case 'rides':
			return [RideSchema, UpdateRideSchema];
		case 'roles':
			return [CreateRoleSchema, UpdateRoleSchema];
		case 'sessions':
			return [SessionSchema, SessionSchema];
		case 'stops':
			return [StopSchema, UpdateStopSchema];
		case 'users':
			return [UserSchema, UpdateUserSchema];
		case 'verification_tokens':
			return [VerificationTokenSchema, VerificationTokenSchema];
		case 'zones':
			return [ZoneSchema, UpdateZoneSchema];
		default:
			return null;
	}
}
