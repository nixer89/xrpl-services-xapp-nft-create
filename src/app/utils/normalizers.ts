
export function rippleEpocheTimeToUTC(rippleEpocheTime: number): number {
    return (rippleEpocheTime+946684800)*1000;
}

export function utcToRippleEpocheTime(utcTime: number): number {
    return (utcTime/1000)-946684800
}

export function getCurrencyCodeForXRPL(currencyCode: string): string {
    if(currencyCode) {
        let currency = currencyCode.trim();

        if(currency && currency.length > 3) {
            currency = Buffer.from(currency, 'utf-8').toString('hex').toUpperCase();

        while(currency.length < 40)
            currency+="0";

        return currency

        } else {
            return currency;
        }
    } else {
        return "";
    }
}

export function nftValuetoXrpl(value: string | number, accountBalance?: string | number): string {
    if(!value) return "";

    const unsignedValue = String(value).replace(/^-/, '')
    const sign = unsignedValue.length < String(value).length ? '-' : ''
    // accountBalance: xrpl string notation, optional, if intention to force NFT check
    if (typeof accountBalance !== 'undefined' && xrplValueToNft(accountBalance) === false) {
      throw new Error('Source balance is not NFT-like')
    }
    if (!unsignedValue.match(/^[0-9]+$/)) {
      throw new Error('Only non-float & non-scientific notation values accepted')
    }
  
    return Number(sign + '0.' + '0'.repeat(81 - unsignedValue.length) + unsignedValue).toExponential();
  }

  // XLS-14d Sample implementation,
//   https://gist.github.com/WietseWind/5ffbf67cd982a7e9bd8f0ded52e60fe3
//   https://hash.xrp.fans/8F3CE0481EF31A1BE44AD7D744D286B0F440780CD0056951948F93A803D47F8B
export function xrplValueToNft(value: string | number): number | boolean {
    if(!value) return false;

    const data = String(Number(value)).split(/e/i)
  
    const finish = (returnValue: string): number | boolean => {
      const unsignedReturnValue = returnValue.replace(/^\-/, '')
      if (data.length > 1 && unsignedReturnValue.slice(0, 2) === '0.' && Number(data[1]) < -70) {
        // Positive below zero amount, could be NFT
        return (sign === '-' ? -1 : 1) * Number(
          (unsignedReturnValue.slice(2) + '0'.repeat(83 - unsignedReturnValue.length))
            .replace(/^0+/, '')
        )
      }
      return false
    }
  
    if (data.length === 1) {
      // Regular (non-exponent)
      return false
    }
  
    let z = ''
    const sign = value < 0 ? '-' : ''
    const str = data[0].replace('.', '')
    let mag = Number(data[1]) + 1
  
    if (mag < 0) {
      z = sign + '0.'
      while (mag++) {
        z += '0'
      }
      return finish(z + str.replace(/^\-/, ''))
    }
    mag -= str.length
  
    while (mag--) {
      z += '0'
    }
    return finish(str + z)
  }