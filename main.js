// main.js
const { program } = require('commander');
const fs = require('fs');

program
  .version('1.0.0')
  .description('Програма для обробки JSON даних валют')
  .requiredOption('-i, --input <type>', 'шлях до файлу для читання')
  .option('-o, --output <type>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль')
  .parse(process.argv);

// Отримання параметрів
const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

try {
  // Читання файлу синхронно
  const data = fs.readFileSync(options.input, 'utf8');
  const jsonData = JSON.parse(data);

  const outputLines = [];

  // Обробка курсів валют
  jsonData.forEach(entry => {
    const date = entry.exchangedate; // Отримання дати обміну
    const rate = entry.rate; // Отримання курсу валют

    outputLines.push(`${date}:${rate}`); // Форматування рядка у вигляді <дата>:<курс>
  });

  // Виведення у консоль, якщо вказано параметр -d
  if (options.display) {
    outputLines.forEach(line => console.log(line));
  }

  // Запис у файл, якщо вказано параметр -o
  if (options.output) {
    fs.writeFileSync(options.output, outputLines.join('\n'), 'utf8');
    if (options.display) {
      console.log(`Результат записано у файл: ${options.output}`);
    }
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('Cannot find input file');
  } else {
    console.error('Помилка:', err.message);
  }
  process.exit(1);
}