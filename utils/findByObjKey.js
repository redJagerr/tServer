export const findByObjKey = (item, obj) =>
	Object.keys(obj).every(k => obj[k].some(f => item[k] === f));
