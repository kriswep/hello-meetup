const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.meetups({ }, info)
    },
    awesomeMeetups(parent, args, ctx, info) {
      return ctx.db.query.meetups({ where: { isAwesome: true } }, info)
    },
    meetup(parent, { id }, ctx, info) {
      return ctx.db.query.meetup({ where: { id } }, info)
    },
  },
  Mutation: {
    createMeetup(parent, { name }, ctx, info) {
      return ctx.db.mutation.createMeetup(
        {
          data: {
            name,
          },
        },
        info,
      )
    },
    markAwesome(parent, { id }, ctx, info) {
      return ctx.db.mutation.updateMeetup(
        {
          where: { id },
          data: { isAwesome: true },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: 'http://localhost:4466/hello-meetup/dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
