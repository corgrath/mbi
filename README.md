# Introduction

The given assignment is clearly to create a [Business Intelligence tool](https://en.wikipedia.org/wiki/Business_intelligence_software)
(similar to [Qlik](http://www.qlik.com/us/), [Tableau](https://www.tableau.com/), the newcomer [Google Data Studio](https://datastudio.google.com/), etc) which can read in an XLSX data source, prepare the data
and then allow the end user to analyze and visualize the data, in order to do their own [Data Discovery](https://en.wikipedia.org/wiki/Data_discovery).

Since I have previously worked as a Front End Developer at Qlik on their [Qlik Sense](http://www.qlik.com/us/products/qlik-sense) tool, I know a few things about creating Business Intelligence tools. Based on this,
I decided to create my own fully functional tool I have named; "Massive Entertainment Budget Business Intelligence Tool".

It uses the same standard paradigm model any other enterprise BI tool would, which is the [Extract, Load and Transform model](https://en.wikipedia.org/wiki/Extract,_load,_transform)
and by allowing the end user specify [Measure and Dimensions](https://community.qlik.com/blogs/qlikviewdesignblog/2013/03/25/dimensions-and-measures).

My solution is generic enough to allow any XLSX data source, not only the one provided by Massive Entertainment, but also various XLSX sample data. 
The solution is also pure JavaScript Front End, even though it internally uses an XLSX parser and in-memory [SQL RDBMS database](https://en.wikipedia.org/wiki/Relational_database_management_system),
meaning there is nothing to install or build; simply visit the page.

More information regarding how to test the solution, how it actually works and other information is described in this document.

The online version of the tool:

- [https://corgrath.github.io/mbi/index.html](https://corgrath.github.io/mbi/index.html)

More information and source:

- [https://github.com/corgrath/mbi/blob/master/README.md](https://github.com/corgrath/mbi/blob/master/README.md)

I would love to show a demo in real life, as I am pretty impressed myself regarding how cool the tool is!



# How to test the solution

This is a pure JavaScript Front End solution. There is nothing to install or build. Simple visit this page:

- [https://corgrath.github.io/mbi/index.html](https://corgrath.github.io/mbi/index.html)


It is built in a generic way to be able to handle any XLSX files.

I have been using the following data files in my development. All can be found in the `/test_data/` folder.

- [empty.xlsx](https://github.com/corgrath/mbi/raw/master/test_data/empty.xlsx)
- [massive.xlsx](https://github.com/corgrath/mbi/raw/master/test_data/massive.xlsx)
- [tableau_superstore_sales.xlsx](https://github.com/corgrath/mbi/raw/master/test_data/tableau_superstore_sales.xlsx)

But please feel free to try out the tool with any other XLSX file!





# How it works, step by step

A quick step by step guide how the tool works. More can be explain in a real life meeting.

* Solution uses the common Extract, Load and Transform model.
* In the "Extract" step, the end user selects an XLSX file. Then that file is read and parsed by a library called
  [js-xlsx](https://github.com/SheetJS/js-xlsx) in order to find each sheet in the file and the data in that file.
* In the "Transform" step, the user can join multiple sheet data. For the XLSX file given by Massive, the user should
  join the "Assignee" from the "DataBase" sheet with the "Name" column on the "UserGroup" sheet.
* In the "Load" step, I create SQL load statements based on the data of the XLSX file. The tool also figures out
  what each data type a column contains (STRING or INT) in order to prepare the data for the SQL import.
* The data is then inserted into an in-memory SQL database called [AlaSQL](http://alasql.org/).
  The reason why I wanted to use an SQL-database in the background, is that Excel data is already relational tabular data,
  and I know for Data Discovery I needed a way to extract data in a fast way according to different measures, dimensions
  and filters.
* In the "Data Discovery" step, the user shown a horizontal bar chart powered by 
  [Chart.js](http://www.chartjs.org/) since it is one the world's most popular open source chart library.
  The user is required to specify "measure" and "dimension" and then "filter groups". If the user specifies multiple
  filter groups, the horizontal bar will stack.
* Everytime the user changes their measure, measure or filter, in reality an SQL statement is created (which can be
  at the bottom of the page) which fetches the data, which is in turn fed to the chart. A really elegant solution!






# Things I could have done, but opt-ed not to do

* Create a dedicated backend - Since I knew I could create the BI tool with front end technologies and the given data files
  were only around 20 KB (but I have tested the solution with 2 MB files), I didn't need a dedicated backend solution.
* It uses plain old ES5 JavaScript with UMD modules - Normally I don't write plain JavaScript anymore (but TypeScript and/or Dart),
  but for this specific assignment and the time constraint, I felt that I could write this in plain JavaScript.
* No build runners tools was used - Due to there was no need to build, package or minification the JavaScript, there was
  no need to use tools such as Grunt, Gulp or WebPack.
* No css preprocessor was used - Since I used Bootstrap CSS, the CSS I actually had to write by hand as minimal,
  there was no need to use LESS or SCSS. The reason why I used Bootstrap is there was no need to create an own look and
  feel for the solution.





# Browser support

The following browsers are supported:

* Latest Firefox
* Latest Chrome
* Latest Edge

Internet Explorer 11 is not supported due to the solution is reading a binary file.





# Open Source libraries

The following Open Source libraries were used in this solution:

- [js-xlsx - Apache License 2.0](https://github.com/SheetJS/js-xlsx/)
- [AlaSQL -  MIT License](https://github.com/agershun/alasql/)
- [Chart.js - MIT License](https://github.com/chartjs/Chart.js)
- [Bootstrap CSS - MIT License](https://github.com/twbs/bootstrap)
