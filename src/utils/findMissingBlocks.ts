import * as mongoDB from 'mongodb'

export const findMissingBlocks = async ({
  collections,
}: {
  collections: {
    block: mongoDB.Collection<mongoDB.Document>
    transaction: mongoDB.Collection<mongoDB.Document>
  }
}) => {
  const pipeline = [
    {
      $group: {
        _id: null,
        maxBlockNumber: { $max: '$number' },
        blockNumbers: { $addToSet: '$number' },
      },
    },
    {
      $project: {
        _id: 0,
        missingBlockNumbers: {
          $setDifference: [{ $range: [0, '$maxBlockNumber'] }, '$blockNumbers'],
        },
      },
    },
  ]
  const res = await collections.block.aggregate(pipeline).toArray()
  return res[0].missingBlockNumbers
}
