import { Pool } from 'pg'

const pg = new Pool({
	connectionString: process.env.DATABASE_URL,
})

interface AreaCenter {
	lng: number
	lat: number
}

// query locations within 40km of specified center
const query = `
SELECT
	*
FROM
	repro_2847."Location"
WHERE
	ST_DWithin(ST_MakePoint(lng, lat)::geography, ST_MakePoint($1, $2)::geography, 40000)
`

async function main(areaCenter: AreaCenter) {
	const result = await pg.query(query, [areaCenter.lng, areaCenter.lat])
	console.log({ result: result.rows })
}

main({
	lat: 52.5400243,
	lng: 13.4221333
})
	.catch((e) => {
		throw e
	})
	.finally(async () => {
		await pg.end()
	})
