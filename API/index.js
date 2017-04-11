'use strict';

var request = require('request'),
    clear   = require('clear'),
    figlet  = require('figlet'),
    inquirer    = require('inquirer'),
    chalk       = require('chalk'),
    Spinner     = require('clui').Spinner;

clear();
console.log(
  chalk.green(
    figlet.textSync('Here you go!', { horizontalLayout: 'full' })
  )
);

//Function to search for a book
function findBook() {
    inquirer.prompt([ {
            type: 'input',
            name: 'bookname',
            message: 'What is the name of the book you are searching for?  '
        },
        {
            type: 'input',
            name: 'author',
            message: "What is the name of the author? (can be left blank, just hit enter)  ",
        },
        ]).then(function (answer) {
            //Make book and author name web address friendly
            var bookname    = answer.bookname.split(/\s+/).join('+'),
                bookauthor  = '+inauthor:' + answer.author.split(/\s+/).join('+');
            if (bookauthor === '+') bookauthor = "";

            var link = 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + bookauthor + '&key=AIzaSyAyKXkBnhznb1LtPC_y_a0PawNbIT-72vw';
            var status = new Spinner('Getting requested information, please wait...');
            status.start();
            request(link, function (err, res, data){
                if (err) return console.log(err);
                data = JSON.parse(data);
                status.stop();

                //Exit if nothing was found
                if (data.totalItems === 0) {
                    console.log('\nNothing found.\n');
                    return exitApp();
                } 

                //Display book information
                console.log('\n Total search results: ' + data.totalItems + chalk.green('\n Results (max of 10): \n'));
                data.items.forEach(function(item){
                    console.log(chalk.yellow('Title: ') + item.volumeInfo.title);
                    console.log(chalk.yellow('Author(s): ') + item.volumeInfo.authors);
                    console.log(chalk.yellow('View book: ') + chalk.green(item.volumeInfo.previewLink) + '\n');
                });
                exitApp();
            });
        }); 
}

function findMovie() {
    inquirer.prompt([ {
            type: 'input',
            name: 'movietitle',
            message: 'What is the title of the movie you are searching for?  '
        },
        
        ]).then(function (answer) {
            //Reformat movie title to fit query
            var movietitle    = answer.movietitle.split(/\s+/).join('+');
            var link = 'http://www.omdbapi.com/?t=' + movietitle + '&plot=full';

            var status = new Spinner('Getting requested information, please wait...');
            status.start();
            request(link, function (err, res, data){
                if (err) {
                    return console.log(err);
                } 

                data = JSON.parse(data);
                status.stop();

                //Exit if nothing was found
                if (data === '') {
                    console.log('\nNothing found.\n');
                    return exitApp();
                } 

                //Display movie details
                console.log(chalk.green('\n Here is your movie information: '));
                console.log(chalk.yellow('Title: ') + data.Title);
                console.log(chalk.yellow('Rated: ') + data.Rated);
                console.log(chalk.yellow('Runtime: ') + data.Runtime);
                console.log(chalk.yellow('Year: ') + data.Year);
                console.log(chalk.yellow('Released: ') + data.Released);
                console.log(chalk.yellow('Genre: ') + data.Genre);
                console.log(chalk.yellow('Director: ') + data.Director);
                console.log(chalk.yellow('Writer: ') + data.Writer);
                console.log(chalk.yellow('Actors: ') + data.Actors);
                console.log(chalk.yellow('Plot: ') + data.Plot);
                console.log(chalk.yellow('Language: ') + data.Language);
                console.log(chalk.yellow('Country: ') + data.Country); 
                console.log(chalk.yellow('Awards: ') + data.Awards);
                console.log(chalk.yellow('Poster: ') + chalk.green(data.Poster) + '\n');
                console.log(chalk.yellow('Type: ') + data.Type);
                console.log(chalk.yellow('DVD: ') + data.DVD);
                console.log(chalk.yellow('BoxOffice: ') + data.BoxOffice);
                console.log(chalk.yellow('Production: ') + data.Production);
                console.log(chalk.yellow('Website: ') + chalk.green(data.Website) + '\n'); 
                
                exitApp();                 
            });
        });
                
          
}

//Function that starts the application
function startApp() {
    inquirer.prompt([ {
    type: 'list',
    name: 'option',
    message: 'What do you want to do?',
    choices: [
      'Search for a book (e.g: Things fall apart)',
      'Search for a movie (e.g: The expendables)',
    ]
  } ]).then(function (answer) {

        if(answer.option === 'Search for a book (e.g: Things fall apart)'){
            findBook();
        }

        if(answer.option === 'Search for a movie (e.g: The expendables)'){
            findMovie();
        }

    });
}

//Exit function
function exitApp() {
    inquirer.prompt([ {
    type: 'list',
    name: 'option',
    message: 'Exit?',
    choices: [
      'Yes',
      'No',
    ]
  } ]).then(function (answer) {
      
        if(answer.option === 'No') return startApp();

        if(answer.option === 'Yes') return console.log(chalk.yellow('*******Hope you liked it?******'));

    });
}

startApp();