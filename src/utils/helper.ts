export function numberToLetter(num: number) {
    if (num <= 0) {
        return ''; // 输入不正确，返回空字符串
    }
    if (num <= 26) {
        const codeA = 'A'.charCodeAt(0); // 获取 A 的 ASCII 码
        const letterCode = codeA + num - 1; // 将数字转换成对应字母的 ASCII 码
        return String.fromCharCode(letterCode); // 使用 fromCharCode 方法将 ASCII 码转换成字符
    }
    const quotient = Math.floor((num - 1) / 26);
    const remainder = ((num - 1) % 26) + 1;
    return numberToLetter(quotient) + numberToLetter(remainder);
}
