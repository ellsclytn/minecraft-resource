import { sentenceCase } from 'change-case'
import * as yargs from 'yargs'

import schema from './schema'

type Item = [string, number]

const getItemCount = (itemName: string, multiple: number = 1, items = {}) => {
  items[itemName] = (items[itemName] || 0) + multiple

  if (schema[itemName]) {
    Object
      .entries(schema[itemName])
      .forEach(([item, qty]: Item) => {
        getItemCount(item, qty * multiple, items)
      })
  }

  return items
}

const buildItemCount = (itemName: string, multiple: number) => {
  Object.entries(getItemCount(itemName, multiple))
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([itemName, count]: Item) => console.log(`${sentenceCase(itemName)}: ${count}`))
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
