import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
	app.get('/memories', async () => {
		const memories = await prisma.memory.findMany({
			orderBy: {
				crearedAt: 'asc',
			},
		})

		return memories.map((memory) => {
			return {
				id: memory.id,
				coverUrl: memory.content.substring(0, 142).concat('...'),
			}
		})
	})

	app.get('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = paramsSchema.parse(request.params)

		const memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		})

		return memory
	})

	app.post('/memories', async (request) => {
		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		})

		const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

		const memory = await prisma.memory.create({
			data: {
				content,
				coverUrl,
				isPublic,
				userId: '0e546933-8f10-4499-b68b-2e733eb6d66a',
			},
		})

		return memory
	})

	app.put('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = paramsSchema.parse(request.params)
		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		})

		const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

		const memory = await prisma.memory.update({
			where: {
				id,
			},
			data: {
				content,
				coverUrl,
				isPublic,
			},
		})

		return memory
	})

	app.delete('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = paramsSchema.parse(request.params)

		await prisma.memory.delete({
			where: {
				id,
			},
		})
	})
}
