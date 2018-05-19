import schema from './schema'
import { sentenceCase } from 'change-case'

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

Object.entries(getItemCount('ultimateEnergyCube', 2))
  .sort(([a], [b]) => (a < b ? -1 : 1))
  .map(([itemName, count]) => console.log(`${sentenceCase(itemName)}: ${count}`))
