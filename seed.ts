import {
	PrismaClient,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.location.create({
		data: {
			lat: 52.5067614,
			lng: 13.4221333,
		}
	})
}

main()
	.catch((e) => {
		throw e
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
