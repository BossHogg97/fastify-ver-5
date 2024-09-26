export function swapId(obj: any) {
  if (obj.id) {
    obj._id = obj.id
    delete obj.id
  } else if (obj._id) {
    obj.id = obj._id
    delete obj._id
  }
  return obj
}
