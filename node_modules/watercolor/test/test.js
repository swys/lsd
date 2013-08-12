var start = 0,
    end = 100;

for (start; start < end; start += 1) {
    console.log("Count :", start);
    console.log('\u001b[' + start + 'm' + 'hello' + '\u001b[0m');
}
