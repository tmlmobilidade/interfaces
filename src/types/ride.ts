export interface RideAnalysis {
	code: string
	grade: string
	message: null | string
	reason: null | string
	status: string
	unit: null | string
	value: null | number
}

export interface Ride {
	agency_id: string
	analysis: RideAnalysis[]
	analysis_timestamp: null | string
	archive_id: string
	code: string
	hashed_shape_code: string
	hashed_trip_code: string
	line_id: string
	operational_day: string
	parse_timestamp: {
		$date: string
	}
	pattern_id: string
	route_id: string
	scheduled_start_time: string
	service_id: string
	status: string
	trip_id: string
	user_notes: string
}

export interface HashedShapePoint {
	shape_pt_lat: string
	shape_pt_lon: string
	shape_pt_sequence: number
}

export interface HashedShape {
	agency_id: string
	code: string
	points: HashedShapePoint[]
	shape_id: string
}

interface HashedTripStop {
	arrival_time: string
	departure_time: string
	drop_off_type: string
	pickup_type: string
	stop_id: string
	stop_lat: string
	stop_lon: string
	stop_name: string
	stop_sequence: number
	timepoint: string
}

export interface HashedTrip {
	agency_id: string
	code: string
	line_id: string
	line_long_name: string
	line_short_name: string
	path: HashedTripStop[]
	pattern_id: string
	route_color: string
	route_id: string
	route_long_name: string
	route_short_name: string
	route_text_color: string
	trip_headsign: string
}
