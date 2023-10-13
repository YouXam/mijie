const datas = []
let i = 0
while (datas.length < 10) {
    const testData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000));
    const expected = testData.reduce((acc, x) => acc ^ x, 0) === 0 ? 'No' : 'Yes';
    if (expected == 'No') datas.push(testData)
    i += 1

}
console.log(datas)