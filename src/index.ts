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

console.log(getItemCount('ultimateEnergyCube', 2))
