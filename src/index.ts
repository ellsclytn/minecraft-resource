import { sentenceCase } from 'change-case'
import * as yargs from 'yargs'

import schema from './schema'

type Item = [string, number]

const items = {}
const remainders = {}

const getItemCount = (itemName: string, quantity: number = 1) => {
  const schemaItem = schema[itemName]
  const requiredQuantity: number = quantity - (remainders[itemName] || 0)

  if (requiredQuantity <= 0) {
    remainders[itemName] = Math.abs(requiredQuantity)

    return items
  }

  const productionFactor: number = (schemaItem && schemaItem.produces) || 1
  const minimumMultiple = Math.ceil(requiredQuantity / productionFactor)
  const multiple = minimumMultiple * productionFactor
  const remainder = multiple - requiredQuantity

  remainders[itemName] = (remainders[itemName] || 0) + remainder
  items[itemName] = (items[itemName] || 0) + multiple

  if (schemaItem) {
    Object
      .entries(schemaItem.recipe)
      .forEach(([item, qty]: Item) => {
        getItemCount(item, qty * minimumMultiple)
      })
  }

  return items
}

const buildItemCount = (itemName: string, multiple: number) => {
  getItemCount(itemName, multiple)
}

const argv = yargs
  .demandCommand(1)
  .usage('Usage: $0 <itemName> [options]')
  .option('number', {
    alias: 'n',
    describe: 'Number to produce',
    default: 1
  })
  .argv

buildItemCount(argv._[0], argv.number)

console.table(Object.entries(items)
  .sort(([a], [b]) => (a < b ? -1 : 1))
  .map(([name, count]: Item) => {
    const minimum = Math.ceil(count)
    const stacks = Math.floor(minimum / 64)
    const singles = minimum % 64

    return {
      name: sentenceCase(name),
      stacks,
      singles,
      leftovers: remainders[name]
    }
  }))
