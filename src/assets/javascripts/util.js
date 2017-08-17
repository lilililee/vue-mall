exports.fMoney = (val) => {
	return '￥' + val.toFixed(2)
}


exports.currency = (value, currency, decimals) => {
	const digitsRE = /(\d{3})(?=\d)/g
	const mark = '￥'

	value = parseFloat(value)
	if (!isFinite(value) || (!value && value !== 0)) return ''
	currency = currency != null ? currency : mark		// undefined == null  true
	decimals = decimals != null ? decimals : 2
	var stringified = Math.abs(value).toFixed(decimals)
	var _int = decimals
	? stringified.slice(0, -1 - decimals)
	: stringified
	var i = _int.length % 3
	var head = i > 0
	? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
	: ''
	var _float = decimals
	? stringified.slice(-1 - decimals)
	: ''
	var sign = value < 0 ? '-' : ''
	return sign + currency + head +
	_int.slice(i).replace(digitsRE, mark + '1,') +
	_float
}
