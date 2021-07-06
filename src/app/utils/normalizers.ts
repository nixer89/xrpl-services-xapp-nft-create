
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

export function nftTokenNumberToXrplFormat(numberOfTokens: number): string {
    if(numberOfTokens < 10)
        return numberOfTokens+"000000000000000e-96";
    else
        return numberOfTokens+"000000000000000e-95"
}