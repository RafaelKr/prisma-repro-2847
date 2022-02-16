import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type QueryType = 'function' | 'tagged-template'

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

const queryTaggedTemplate = (areaCenter: AreaCenter) =>
prisma.$queryRaw`
SELECT
	*
FROM
	repro_2847."Location"
WHERE
	ST_DWithin(ST_MakePoint(lng, lat)::geography, ST_MakePoint(${areaCenter.lng}, ${areaCenter.lat})::geography, 40000)
`

async function main(areaCenter: AreaCenter, type: QueryType) {
	let result: any

	switch (type) {
		case 'tagged-template':
			result = await queryTaggedTemplate(areaCenter)
			break
		case 'function':
		default:
			result = await prisma.$queryRawUnsafe(query, [areaCenter.lng, areaCenter.lat])
			break
	}

	console.log({ result })
}

main({
	lat: 52.5400243,
	lng: 13.4221333
}, process.argv[2] as QueryType)
	.catch((e) => {
		throw e
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
