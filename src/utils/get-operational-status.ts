/* * */

import { type Ride, type RideDisplay } from '@/types';
import { DateTime } from 'luxon';

/**
 * This function returns the correct operational status for a given Ride, base on its 'scheduled_start_time' and 'seen_last_at' values.
 * A Ride can be considered 'scheduled', 'missed', 'running' or 'ended'.
 * Value 'scheduled' means that the ride start time is still in the future, and no Vehicle Events were found for it.
 * Value 'missed' means that the ride start time is at least 10 minutes ago, and no Vehicle Events were found for it.
 * Value 'running' means that the value of seen_last_at is from less than 10 minutes ago.
 * Value 'ended' means that the value of seen_last_at is from more than 10 minutes ago.
 * @param rideData The Ride to be analyzed.
 * @returns The operational status for the Ride.
 */
export function getOperationalStatus(rideData: Ride): RideDisplay['operational_status'] {
	//

	//
	// Check if the ride start time is in the future.

	const nowInUnixSeconds = DateTime.now().toUnixInteger();
	const rideStartTimeInUnixSeconds = DateTime.fromJSDate(rideData.start_time_scheduled).toUnixInteger();

	const secondsFromRideStartToNow = nowInUnixSeconds - rideStartTimeInUnixSeconds;

	//
	// If the ride start time is less than or equal to 10 minutes ago, or in the future,
	// and there are no VehicleEvents for it, then the ride is considered 'scheduled'.

	if (secondsFromRideStartToNow <= 600 && !rideData.seen_last_at) {
		return 'scheduled';
	}

	//
	// If the ride start time is at least 10 minutes ago, and there are no VehicleEvents for it,
	// then the ride is considered 'missed' and no further analysis is needed.

	if (secondsFromRideStartToNow > 600 && !rideData.seen_last_at) {
		return 'missed';
	}

	//
	// If there is seen_last_at for the ride, and the most recent one was received less than or exactly at 10 minutes ago,
	// then the ride is considered 'running'. Else it is considered 'ended'.

	const mostRecentVehicleEventInUnixSeconds = DateTime.fromJSDate(rideData.seen_last_at ?? new Date(0)).toUnixInteger();
	const secondsFromMostRecentVehicleEventToNow = nowInUnixSeconds - mostRecentVehicleEventInUnixSeconds;

	if (secondsFromMostRecentVehicleEventToNow <= 600) {
		return 'running';
	}

	return 'ended';

	//
}
