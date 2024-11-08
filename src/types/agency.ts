export interface Agency {
	code: string
	created_at: Date
	email: string
	fare_url: string
	is_locked: boolean
	lang: string
	name: string
	operation_start_date: string // Consider using a Date type if you plan to parse this string
	phone: string
	price_per_km: number
	timezone: string
	total_vkm_per_year: number
	updated_at: Date
	url: string
}
