import schema from './schema'

type Item = [string, number]

const getItemCount = (itemName: string, multiple: number = 1) => {
  console.log(itemName, multiple)

  if (schema[itemName]) {
    Object
      .entries(schema[itemName])
      .forEach(([item, qty]: Item) => {
        getItemCount(item, qty * multiple)
      })
  }
}

getItemCount('advancedUniversalCable', 8)
