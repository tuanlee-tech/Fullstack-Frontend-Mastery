<div align="center">

  <h1> 30 Days Of React: JavaScript Refresher</h1>
  <a class="header-badge" target="_blank" href="https://www.linkedin.com/in/asabeneh/">
    <img src="https://img.shields.io/badge/style--5eba00.svg?label=LinkedIn&logo=linkedin&style=social">
  </a>

  <a class="header-badge" target="_blank" href="https://twitter.com/Asabeneh">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/asabeneh?style=social">
  </a>

<sub>Author:
<a href="https://www.linkedin.com/in/asabeneh/" target="_blank">Asabeneh Yetayeh</a><br>
<small> October, 2020</small>
</sub>

</div>

[<< Day 0](../readMe.md) | [Day 2 >>](../02_Day_Introduction_to_React/02_introduction_to_react.md)

![30 Days of React banner](../images/30_days_of_react_banner_day_1.jpg)

- [JavaScript Refresher](#javascript-refresher)
  - [0. Adding JavaScript to a Web Page](#0-adding-javascript-to-a-web-page)
    - [Inline Script](#inline-script)
    - [Internal Script](#internal-script)
    - [External Script](#external-script)
    - [Multiple External Scripts](#multiple-external-scripts)
  - [1. Variables](#1-variables)
  - [2. Data types](#2-data-types)
  - [3. Arrays](#3-arrays)
    - [How to create an empty array](#how-to-create-an-empty-array)
    - [How to create an array with values](#how-to-create-an-array-with-values)
    - [Creating an array using split](#creating-an-array-using-split)
    - [Accessing array items using index](#accessing-array-items-using-index)
    - [Modifying array element](#modifying-array-element)
    - [Methods to manipulate array](#methods-to-manipulate-array)
      - [Array Constructor](#array-constructor)
      - [Creating static values with fill](#creating-static-values-with-fill)
      - [Concatenating array using concat](#concatenating-array-using-concat)
      - [Getting array length](#getting-array-length)
      - [Getting index of an element in an array](#getting-index-of-an-element-in-an-array)
      - [Getting last index of an element in array](#getting-last-index-of-an-element-in-array)
      - [Checking array](#checking-array)
      - [Converting array to string](#converting-array-to-string)
      - [Joining array elements](#joining-array-elements)
      - [Slice array elements](#slice-array-elements)
      - [Splice method in array](#splice-method-in-array)
      - [Adding item to an array using push](#adding-item-to-an-array-using-push)
      - [Removing the end element using pop](#removing-the-end-element-using-pop)
      - [Removing an element from the beginning](#removing-an-element-from-the-beginning)
      - [Add an element from the beginning](#add-an-element-from-the-beginning)
      - [Reversing array order](#reversing-array-order)
      - [Sorting elements in array](#sorting-elements-in-array)
    - [Array of arrays](#array-of-arrays)
  - [💻 Exercise](#-exercise)
      - [Exercise: Level 1](#exercise-level-1)
      - [Exercise: Level 2](#exercise-level-2)
      - [Exercise: Level 3](#exercise-level-3)
  - [4. Conditionals](#4-conditionals)
    - [If](#if)
    - [If Else](#if-else)
    - [If Else if Else](#if-else-if-else)
    - [Switch](#switch)
    - [Ternary Operators](#ternary-operators)
  - [💻 Exercises](#-exercises)
      - [Exercises: Level 1](#exercises-level-1)
      - [Exercises: Level 2](#exercises-level-2)
      - [Exercises: Level 3](#exercises-level-3)
  - [5. Loops](#5-loops)
    - [Types of Loops](#types-of-loops)
      - [1. for](#1-for)
      - [2. while](#2-while)
      - [3. do while](#3-do-while)
      - [4. for of](#4-for-of)
      - [5. forEach](#5-foreach)
      - [6. for in](#6-for-in)
    - [Interrupting a loop and skipping an item](#interrupting-a-loop-and-skipping-an-item)
      - [break](#break)
      - [continue](#continue)
    - [Conclusions](#conclusions)
  - [6. Scope](#6-scope)
    - [Window Scope](#window-scope)
    - [Global scope](#global-scope)
    - [Local scope](#local-scope)
  - [7. Object](#7-object)
    - [Creating an empty object](#creating-an-empty-object)
    - [Creating an objecting with values](#creating-an-objecting-with-values)
    - [Getting values from an object](#getting-values-from-an-object)
    - [Creating object methods](#creating-object-methods)
    - [Setting new key for an object](#setting-new-key-for-an-object)
    - [Object Methods](#object-methods)
      - [Getting object keys using Object.keys()](#getting-object-keys-using-objectkeys)
      - [Getting object values using Object.values()](#getting-object-values-using-objectvalues)
      - [Getting object keys and values using Object.entries()](#getting-object-keys-and-values-using-objectentries)
      - [Checking properties using hasOwnProperty()](#checking-properties-using-hasownproperty)
  - [💻 Exercises](#-exercises-1)
      - [Exercises: Level 1](#exercises-level-1-1)
      - [Exercises: Level 2](#exercises-level-2-1)
      - [Exercises: Level 3](#exercises-level-3-1)
  - [8. Functions](#8-functions)
    - [Function Declaration](#function-declaration)
    - [Function without a parameter and return](#function-without-a-parameter-and-return)
    - [Function returning value](#function-returning-value)
    - [Function with a parameter](#function-with-a-parameter)
    - [Function with two parameters](#function-with-two-parameters)
    - [Function with many parameters](#function-with-many-parameters)
    - [Function with unlimited number of parameters](#function-with-unlimited-number-of-parameters)
      - [Unlimited number of parameters in regular function](#unlimited-number-of-parameters-in-regular-function)
      - [Unlimited number of parameters in arrow function](#unlimited-number-of-parameters-in-arrow-function)
    - [Anonymous Function](#anonymous-function)
    - [Expression Function](#expression-function)
    - [Self Invoking Functions](#self-invoking-functions)
    - [Arrow Function](#arrow-function)
    - [Function with default parameters](#function-with-default-parameters)
    - [Function declaration versus Arrow function](#function-declaration-versus-arrow-function)
  - [💻 Exercises](#-exercises-2)
      - [Exercises: Level 1](#exercises-level-1-2)
      - [Exercises: Level 2](#exercises-level-2-2)
      - [Exercises: Level 3](#exercises-level-3-2)
  - [9. Higher Order Function](#9-higher-order-function)
    - [Callback](#callback)
    - [Returning function](#returning-function)
    - [setting time](#setting-time)
      - [setInterval](#setinterval)
      - [setTimeout](#settimeout)
  - [10. Destructuring and Spreading](#10-destructuring-and-spreading)
    - [What is Destructuring?](#what-is-destructuring)
    - [What can we destructure?](#what-can-we-destructure)
      - [1. Destructuring arrays](#1-destructuring-arrays)
      - [2. Destructuring objects](#2-destructuring-objects)
    - [Exercises](#exercises)
    - [Spread or Rest Operator](#spread-or-rest-operator)
      - [Spread operator to get the rest of array elements](#spread-operator-to-get-the-rest-of-array-elements)
      - [Spread operator to copy array](#spread-operator-to-copy-array)
      - [Spread operator to copy object](#spread-operator-to-copy-object)
      - [Spread operator with arrow function](#spread-operator-with-arrow-function)
  - [11. Functional Programming](#11-functional-programming)
    - [1. forEach](#1-foreach)
    - [2. map](#2-map)
    - [3. filter](#3-filter)
    - [4. reduce](#4-reduce)
    - [5. find](#5-find)
    - [6. findIndex](#6-findindex)
    - [7. some](#7-some)
    - [8. every](#8-every)
    - [Exercises](#exercises-1)
  - [12. Classes](#12-classes)
    - [Defining a classes](#defining-a-classes)
    - [Class Instantiation](#class-instantiation)
    - [Class Constructor](#class-constructor)
    - [Default values with constructor](#default-values-with-constructor)
    - [Class methods](#class-methods)
    - [Properties with initial value](#properties-with-initial-value)
    - [getter](#getter)
    - [setter](#setter)
    - [Static method](#static-method)
    - [Inheritance](#inheritance)
    - [Overriding methods](#overriding-methods)
    - [Exercises](#exercises-2)
      - [Exercises Level 1](#exercises-level-1-3)
      - [Exercises Level 2](#exercises-level-2-3)
      - [Exercises Level 3](#exercises-level-3-3)
  - [13 Document Object Model(DOM)](#13-document-object-modeldom)

## JavaScript Refresher

### 0. Adding JavaScript to a Web Page

JavaScript can be added to a web page in three different ways:

- **_Inline script_**
- **_Internal script_**
- **_External script_**
- **_Multiple External scripts_**

The following sections show different ways of adding JavaScript code to your web page.

#### Inline Script

Create a project folder on your desktop or in any location, name it 30DaysOfJS and create an **_index.html_** file in the project folder. Then paste the following code and open it in a browser, for example [Chrome](https://www.google.com/chrome/).

```html
<!DOCTYPE html>
<html>
  <head>
    <title>30DaysOfScript:Inline Script</title>
  </head>
  <body>
    <button onclick="alert('Welcome to 30DaysOfJavaScript!')">Click Me</button>
  </body>
</html>
```

Now, you just wrote your first inline script. We can create a pop up alert message using the _alert()_ built-in function.

#### Internal Script

The internal script can be written in the _head_ or the _body_, but it is preferred to put it on the body of the HTML document.
First, let us write on the head part of the page.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>30DaysOfScript:Internal Script</title>
    <script>
      console.log('Welcome to 30DaysOfJavaScript')
    </script>
  </head>
  <body></body>
</html>
```

This is how we write an internal script most of the time. Writing the JavaScript code in the body section is the most preferred option. Open the browser console to see the output from the console.log()

```html
<!DOCTYPE html>
<html>
  <head>
    <title>30DaysOfScript:Internal Script</title>
  </head>
  <body>
    <button onclick="alert('Welcome to 30DaysOfJavaScript!');">Click Me</button>
    <script>
      console.log('Welcome to 30DaysOfJavaScript')
    </script>
  </body>
</html>
```

Open the browser console to see the output from the console.log()

![js code from vscode](../images/js_code_vscode.png)

#### External Script

Similar to the internal script, the external script link can be on the header or body, but it is preferred to put it in the body.
First, we should create an external JavaScript file with .js extension. All files ending with .js extension. All files ending with .js extension are JavaScript files. Create a file named introduction.js inside your project directory and write the following code and link this .js file at the bottom of the body.

```js
console.log('Welcome to 30DaysOfJavaScript')
```

External scripts in the _head_:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>30DaysOfJavaScript:External script</title>
    <script src="introduction.js"></script>
  </head>
  <body></body>
</html>
```

External scripts in the _body_:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>30DaysOfJavaScript:External script</title>
  </head>
  <body>
    //it could be in the header or in the body // Here is the recommended place
    to put the external script
    <script src="introduction.js"></script>
  </body>
</html>
```

Open the browser console to see the output of the console.log()

#### Multiple External Scripts

We can also link multiple external JavaScript files to a web page.
Create a helloworld.js file inside the 30DaysOfJS folder and write the following code.

```js
console.log('Hello, World!')
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Multiple External Scripts</title>
  </head>
  <body>
    <script src="./helloworld.js"></script>
    <script src="./introduction.js"></script>
  </body>
</html>
```

_Your main.js file should be below all other scripts_. It is very important to remember this.

![Multiple Script](../images/multiple_script.png)

### 1. Variables

We use _var_, _let_ and _const_ to declare a variable. The _var_ is functions scope, however _let_ and _const_ are block scope. In this challenge we use ES6 and above features of JavaScript. Avoid using _var_.

```js
let firstName = 'Asabeneh'
firstName = 'Eyob'

const PI = 3.14 // Not allowed to reassign PI to a new value
// PI = 3.
```

### 2. Data types

If you do not feel comfortable with data types check the following [link](https://github.com/Asabeneh/30-Days-Of-JavaScript/blob/master/02_Day_Data_types/02_day_data_types.md)

### 3. Arrays

In contrast to variables, an array can store _multiple values_. Each value in an array has an _index_, and each index has _a reference in a memory address_. Each value can be accessed by using their _indexes_. The index of an array starts from _zero_, and the index of the last element is less by one from the length of the array.

An array is a collection of different data types which are ordered and changeable(modifiable). An array allows storing duplicate elements and different data types. An array can be empty, or it may have different data type values.

#### How to create an empty array

In JavaScript, we can create an array in different ways. Let us see different ways to create an array.
It is very common to use _const_ instead of _let_ to declare an array variable. If you are using const it means you do not use that variable name again.

- Using Array constructor

```js
// syntax
const arr = Array()
// or
// let arr = new Array()
console.log(arr) // []
```

- Using square brackets([])

```js
// syntax
// This the most recommended way to create an empty list
const arr = []
console.log(arr)
```

#### How to create an array with values

Array with initial values. We use _length_ property to find the length of an array.

```js
const numbers = [0, 3.14, 9.81, 37, 98.6, 100] // array of numbers
const fruits = ['banana', 'orange', 'mango', 'lemon'] // array of strings, fruits
const vegetables = ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot'] // array of strings, vegetables
const animalProducts = ['milk', 'meat', 'butter', 'yoghurt'] // array of strings, products
const webTechs = ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node', 'MongDB'] // array of web technologies
const countries = ['Finland', 'Denmark', 'Sweden', 'Norway', 'Iceland'] // array of strings, countries

// Print the array and its length

console.log('Numbers:', numbers)
console.log('Number of numbers:', numbers.length)

console.log('Fruits:', fruits)
console.log('Number of fruits:', fruits.length)

console.log('Vegetables:', vegetables)
console.log('Number of vegetables:', vegetables.length)

console.log('Animal products:', animalProducts)
console.log('Number of animal products:', animalProducts.length)

console.log('Web technologies:', webTechs)
console.log('Number of web technologies:', webTechs.length)

console.log('Countries:', countries)
console.log('Number of countries:', countries.length)
```

```sh
Numbers: [0, 3.14, 9.81, 37, 98.6, 100]
Number of numbers: 6
Fruits: ['banana', 'orange', 'mango', 'lemon']
Number of fruits: 4
Vegetables: ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot']
Number of vegetables: 5
Animal products: ['milk', 'meat', 'butter', 'yoghurt']
Number of animal products: 4
Web technologies: ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node', 'MongDB']
Number of web technologies: 7
Countries: ['Finland', 'Estonia', 'Denmark', 'Sweden', 'Norway']
Number of countries: 5
```

- Array can have items of different data types

```js
const arr = [
  'Asabeneh',
  250,
  true,
  { country: 'Finland', city: 'Helsinki' },
  { skills: ['HTML', 'CSS', 'JS', 'React', 'Python'] },
] // arr containing different data types
console.log(arr)
```

#### Creating an array using split

As we have seen in the earlier section, we can split a string at different positions, and we can change to an array. Let us see the examples below.

```js
let js = 'JavaScript'
const charsInJavaScript = js.split('')

console.log(charsInJavaScript) // ["J", "a", "v", "a", "S", "c", "r", "i", "p", "t"]

let companiesString = 'Facebook, Google, Microsoft, Apple, IBM, Oracle, Amazon'
const companies = companiesString.split(',')

console.log(companies) // ["Facebook", " Google", " Microsoft", " Apple", " IBM", " Oracle", " Amazon"]
let txt =
  'I love teaching and empowering people. I teach HTML, CSS, JS, React, Python.'
const words = txt.split(' ')

console.log(words)
// the text has special characters think how you can just get only the words
// ["I", "love", "teaching", "and", "empowering", "people.", "I", "teach", "HTML,", "CSS,", "JS,", "React,", "Python"]
```

#### Accessing array items using index

We access each element in an array using their index. An array index starts from 0. The picture below clearly shows the index of each element in the array.

![arr index](../images/array_index.png)

```js
const fruits = ['banana', 'orange', 'mango', 'lemon']
let firstFruit = fruits[0] // we are accessing the first item using its index

console.log(firstFruit) // banana

secondFruit = fruits[1]
console.log(secondFruit) // orange

let lastFruit = fruits[3]
console.log(lastFruit) // lemon
// Last index can be calculated as follows

let lastIndex = fruits.length - 1
lastFruit = fruits[lastIndex]

console.log(lastFruit) // lemon
```

```js
const numbers = [0, 3.14, 9.81, 37, 98.6, 100] // set of numbers

console.log(numbers.length) // => to know the size of the array, which is 6
console.log(numbers) // -> [0, 3.14, 9.81, 37, 98.6, 100]
console.log(numbers[0]) //  -> 0
console.log(numbers[5]) //  -> 100

let lastIndex = numbers.length - 1
console.log(numbers[lastIndex]) // -> 100
```

```js
const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
] // List of web technologies

console.log(webTechs) // all the array items
console.log(webTechs.length) // => to know the size of the array, which is 7
console.log(webTechs[0]) //  -> HTML
console.log(webTechs[6]) //  -> MongoDB

let lastIndex = webTechs.length - 1
console.log(webTechs[lastIndex]) // -> MongoDB
```

```js
const countries = [
  'Albania',
  'Bolivia',
  'Canada',
  'Denmark',
  'Ethiopia',
  'Finland',
  'Germany',
  'Hungary',
  'Ireland',
  'Japan',
  'Kenya',
] // List of countries

console.log(countries) // -> all countries in array
console.log(countries[0]) //  -> Albania
console.log(countries[10]) //  -> Kenya

let lastIndex = countries.length - 1
console.log(countries[lastIndex]) //  -> Kenya
```

```js
const shoppingCart = [
  'Milk',
  'Mango',
  'Tomato',
  'Potato',
  'Avocado',
  'Meat',
  'Eggs',
  'Sugar',
] // List of food products

console.log(shoppingCart) // -> all shoppingCart in array
console.log(shoppingCart[0]) //  -> Milk
console.log(shoppingCart[7]) //  -> Sugar

let lastIndex = shoppingCart.length - 1
console.log(shoppingCart[lastIndex]) //  -> Sugar
```

#### Modifying array element

An array is mutable(modifiable). Once an array is created, we can modify the contents of the array elements.

```js
const numbers = [1, 2, 3, 4, 5]
numbers[0] = 10 // changing 1 at index 0 to 10
numbers[1] = 20 // changing  2 at index 1 to 20

console.log(numbers) // [10, 20, 3, 4, 5]

const countries = [
  'Albania',
  'Bolivia',
  'Canada',
  'Denmark',
  'Ethiopia',
  'Finland',
  'Germany',
  'Hungary',
  'Ireland',
  'Japan',
  'Kenya',
]

countries[0] = 'Afghanistan' // Replacing Albania by Afghanistan
let lastIndex = countries.length - 1
countries[lastIndex] = 'Korea' // Replacing Kenya by Korea

console.log(countries)
```

```sh
["Afghanistan", "Bolivia", "Canada", "Denmark", "Ethiopia", "Finland", "Germany", "Hungary", "Ireland", "Japan", "Korea"]
```

#### Methods to manipulate array

There are different methods to manipulate an array. These are some of the available methods to deal with arrays:_Array, length, concat, indexOf, slice, splice, join, toString, includes, lastIndexOf, isArray, fill, push, pop, shift, unshift_

##### Array Constructor

Array:To create an array.

```js
const arr = Array() // creates an an empty array
console.log(arr)

const eightEmptyValues = Array(8) // it creates eight empty values
console.log(eightEmptyValues) // [empty x 8]
```

##### Creating static values with fill

fill: Fill all the array elements with a static value

```js
const arr = Array() // creates an an empty array
console.log(arr)

const eightXvalues = Array(8).fill('X') // it creates eight element values filled with 'X'
console.log(eightXvalues) // ['X', 'X','X','X','X','X','X','X']

const eight0values = Array(8).fill(0) // it creates eight element values filled with '0'
console.log(eight0values) // [0, 0, 0, 0, 0, 0, 0, 0]

const four4values = Array(4).fill(4) // it creates 4 element values filled with '4'
console.log(four4values) // [4, 4, 4, 4]
```

##### Concatenating array using concat

concat:To concatenate two arrays.

```js
const firstList = [1, 2, 3]
const secondList = [4, 5, 6]
const thirdList = firstList.concat(secondList)

console.log(thirdList) // [1, 2, 3, 4, 5, 6]
```

```js
const fruits = ['banana', 'orange', 'mango', 'lemon'] // array of fruits
const vegetables = ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot'] // array of vegetables
const fruitsAndVegetables = fruits.concat(vegetables) // concatenate the two arrays

console.log(fruitsAndVegetables)
```

```sh
["banana", "orange", "mango", "lemon", "Tomato", "Potato", "Cabbage", "Onion", "Carrot"]
```

##### Getting array length

Length:To know the size of the array

```js
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.length) // -> 5 is the size of the array
```

##### Getting index of an element in an array

indexOf:To check if an item exist in an array. If it exists it returns the index else it returns -1.

```js
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.indexOf(5)) // -> 4
console.log(numbers.indexOf(0)) // -> -1
console.log(numbers.indexOf(1)) // -> 0
console.log(numbers.indexOf(6)) // -> -1
```

Check an element if it exist in an array.

- Check items in a list

```js
// let us check if a banana exist in the array

const fruits = ['banana', 'orange', 'mango', 'lemon']
let index = fruits.indexOf('banana') // 0

if (index != -1) {
  console.log('This fruit does exist in the array')
} else {
  console.log('This fruit does not exist in the array')
}
// This fruit does exist in the array

// we can use also ternary here
index != -1
  ? console.log('This fruit does exist in the array')
  : console.log('This fruit does not exist in the array')

// let us check if a avocado exist in the array
let indexOfAvocado = fruits.indexOf('avocado') // -1, if the element not found index is -1
if (indexOfAvocado != -1) {
  console.log('This fruit does exist in the array')
} else {
  console.log('This fruit does not exist in the array')
}
// This fruit does not exist in the array
```

##### Getting last index of an element in array

lastIndexOf: It gives the position of the last item in the array. If it exist, it returns the index else it returns -1.

```js
const numbers = [1, 2, 3, 4, 5, 3, 1, 2]

console.log(numbers.lastIndexOf(2)) // 7
console.log(numbers.lastIndexOf(0)) // -1
console.log(numbers.lastIndexOf(1)) //  6
console.log(numbers.lastIndexOf(4)) //  3
console.log(numbers.lastIndexOf(6)) // -1
```

includes:To check if an item exist in an array. If it exist it returns the true else it returns false.

```js
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.includes(5)) // true
console.log(numbers.includes(0)) // false
console.log(numbers.includes(1)) // true
console.log(numbers.includes(6)) // false

const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
] // List of web technologies

console.log(webTechs.includes('Node')) // true
console.log(webTechs.includes('C')) // false
```

##### Checking array

Array.isArray:To check if the data type is an array

```js
const numbers = [1, 2, 3, 4, 5]
console.log(Array.isArray(numbers)) // true

const number = 100
console.log(Array.isArray(number)) // false
```

##### Converting array to string

toString:Converts array to string

```js
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.toString()) // 1,2,3,4,5

const names = ['Asabeneh', 'Mathias', 'Elias', 'Brook']
console.log(names.toString()) // Asabeneh,Mathias,Elias,Brook
```

##### Joining array elements

join: It is used to join the elements of the array, the argument we passed in the join method will be joined in the array and return as a string. By default, it joins with a comma, but we can pass different string parameter which can be joined between the items.

```js
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.join()) // 1,2,3,4,5

const names = ['Asabeneh', 'Mathias', 'Elias', 'Brook']

console.log(names.join()) // Asabeneh,Mathias,Elias,Brook
console.log(names.join('')) //AsabenehMathiasEliasBrook
console.log(names.join(' ')) //Asabeneh Mathias Elias Brook
console.log(names.join(', ')) //Asabeneh, Mathias, Elias, Brook
console.log(names.join(' # ')) //Asabeneh # Mathias # Elias # Brook

const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
] // List of web technologies

console.log(webTechs.join()) // "HTML,CSS,JavaScript,React,Redux,Node,MongoDB"
console.log(webTechs.join(' # ')) // "HTML # CSS # JavaScript # React # Redux # Node # MongoDB"
```

##### Slice array elements

Slice: To cut out a multiple items in range. It takes two parameters:starting and ending position. It doesn't include the ending position.

```js
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.slice()) // -> it copies all  item
console.log(numbers.slice(0)) // -> it copies all  item
console.log(numbers.slice(0, numbers.length)) // it copies all  item
console.log(numbers.slice(1, 4)) // -> [2,3,4] // it doesn't include the ending position
```

##### Splice method in array

Splice: It takes three parameters:Starting position, number of times to be removed and number of items to be added.

```js
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.splice()) // -> remove all items
```

```js
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.splice(0, 1)) // remove the first item
```

```js
const numbers = [1, 2, 3, 4, 5, 6]
console.log(numbers.splice(3, 3, 7, 8, 9)) // -> [1, 2, 3, 7, 8, 9] //it removes three item and replace three items
```

##### Adding item to an array using push

Push: adding item in the end. To add item to the end of an existing array we use the push method.

```js
// syntax
const arr = ['item1', 'item2', 'item3']
arr.push('new item')

console.log(arr)
// ['item1', 'item2','item3','new item']
```

```js
const numbers = [1, 2, 3, 4, 5]
numbers.push(6)

console.log(numbers) // -> [1,2,3,4,5,6]

numbers.pop() // -> remove one item from the end
console.log(numbers) // -> [1,2,3,4,5]
```

```js
let fruits = ['banana', 'orange', 'mango', 'lemon']
fruits.push('apple')

console.log(fruits) // ['banana', 'orange', 'mango', 'lemon', 'apple']

fruits.push('lime')
console.log(fruits) // ['banana', 'orange', 'mango', 'lemon', 'apple', 'lime']
```

##### Removing the end element using pop

pop: Removing item in the end.

```js
const numbers = [1, 2, 3, 4, 5]
numbers.pop() // -> remove one item from the end

console.log(numbers) // -> [1,2,3,4]
```

##### Removing an element from the beginning

shift: Removing one array element in the beginning of the array.

```js
const numbers = [1, 2, 3, 4, 5]
numbers.shift() // -> remove one item from the beginning

console.log(numbers) // -> [2,3,4,5]
```

##### Add an element from the beginning

unshift: Adding array element in the beginning of the array.

```js
const numbers = [1, 2, 3, 4, 5]
numbers.unshift(0) // -> add one item from the beginning

console.log(numbers) // -> [0,1,2,3,4,5]
```

##### Reversing array order

reverse: reverse the order of an array.

```js
const numbers = [1, 2, 3, 4, 5]
numbers.reverse() // -> reverse array order

console.log(numbers) // [5, 4, 3, 2, 1]

numbers.reverse()
console.log(numbers) // [1, 2, 3, 4, 5]
```

##### Sorting elements in array

sort: arrange array elements in ascending order. Sort takes a call back function, we will see how we use sort with a call back function in the coming sections.

```js
const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
]

webTechs.sort()
console.log(webTechs) // ["CSS", "HTML", "JavaScript", "MongoDB", "Node", "React", "Redux"]

webTechs.reverse() // after sorting we can reverse it
console.log(webTechs) // ["Redux", "React", "Node", "MongoDB", "JavaScript", "HTML", "CSS"]
```

#### Array of arrays

Array can store different data types including an array itself. Let us create an array of arrays

```js
const firstNums = [1, 2, 3]
const secondNums = [1, 4, 9]

const arrayOfArray = [
  [1, 2, 3],
  [1, 2, 3],
]
console.log(arrayOfArray[0]) // [1, 2, 3]

const frontEnd = ['HTML', 'CSS', 'JS', 'React', 'Redux']
const backEnd = ['Node', 'Express', 'MongoDB']
const fullStack = [frontEnd, backEnd]
console.log(fullStack) // [["HTML", "CSS", "JS", "React", "Redux"], ["Node", "Express", "MongoDB"]]
console.log(fullStack.length) // 2
console.log(fullStack[0]) // ["HTML", "CSS", "JS", "React", "Redux"]
console.log(fullStack[1]) // ["Node", "Express", "MongoDB"]
```
### 💻 Exercise

##### Exercise: Level 1

```js
const countries = [
  'Albania',
  'Bolivia',
  'Canada',
  'Denmark',
  'Ethiopia',
  'Finland',
  'Germany',
  'Hungary',
  'Ireland',
  'Japan',
  'Kenya',
]

const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
]
```

1. Declare an _empty_ array;
   - Khai báo một mảng _rỗng_;
   ```js
   let emptyArray = [];
   ```

2. Declare an array with more than 5 number of elements
   - Khai báo một mảng có hơn 5 phần tử
   ```js
   let numbers = [1, 2, 3, 4, 5, 6, 7];
   ```

3. Find the length of your array
   - Tìm độ dài của mảng
   ```js
   console.log(numbers.length); // Output: 7
   ```

4. Get the first item, the middle item and the last item of the array
   - Lấy phần tử đầu tiên, phần tử giữa và phần tử cuối của mảng
   ```js
   console.log(numbers[0]); // First: 1
   console.log(numbers[Math.floor(numbers.length / 2)]); // Middle: 4
   console.log(numbers[numbers.length - 1]); // Last: 7
   ```

5. Declare an array called _mixedDataTypes_, put different data types in the array and find the length of the array. The array size should be greater than 5
   - Khai báo một mảng có tên _mixedDataTypes_, đưa các kiểu dữ liệu khác nhau vào mảng và tìm độ dài của mảng. Kích thước mảng phải lớn hơn 5
   ```js
   let mixedDataTypes = [1, "hello", true, { name: "John" }, null, 42.5];
   console.log(mixedDataTypes.length); // Output: 6
   ```

6. Declare an array variable name itCompanies and assign initial values Facebook, Google, Microsoft, Apple, IBM, Oracle and Amazon
   - Khai báo một biến mảng tên itCompanies và gán các giá trị ban đầu Facebook, Google, Microsoft, Apple, IBM, Oracle và Amazon
   ```js
   let itCompanies = ["Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"];
   ```

7. Print the array using _console.log()_
   - In mảng bằng _console.log()_
   ```js
   console.log(itCompanies);
   ```

8. Print the number of companies in the array
   - In số lượng công ty trong mảng
   ```js
   console.log(itCompanies.length); // Output: 7
   ```

9. Print the first company, middle and last company
   - In công ty đầu tiên, công ty giữa và công ty cuối
   ```js
   console.log(itCompanies[0]); // First: Facebook
   console.log(itCompanies[Math.floor(itCompanies.length / 2)]); // Middle: Apple
   console.log(itCompanies[itCompanies.length - 1]); // Last: Amazon
   ```

10. Print out each company
    - In từng công ty
    ```js
    itCompanies.forEach(company => console.log(company));
    ```

11. Change each company name to uppercase one by one and print them out
    - Thay đổi tên từng công ty thành chữ in hoa và in ra
    ```js
    itCompanies.forEach(company => console.log(company.toUpperCase()));
    ```

12. Print the array like as a sentence: Facebook, Google, Microsoft, Apple, IBM,Oracle and Amazon are big IT companies.
    - In mảng dưới dạng một câu: Facebook, Google, Microsoft, Apple, IBM, Oracle và Amazon là những công ty CNTT lớn.
    ```js
    console.log(itCompanies.join(", ") + " are big IT companies.");
    ```

13. Check if a certain company exists in the itCompanies array. If it exist return the company else return a company is _not found_
    - Kiểm tra xem một công ty có tồn tại trong mảng itCompanies không. Nếu tồn tại, trả về công ty đó, nếu không, trả về công ty _không tìm thấy_
    ```js
    let companyToCheck = "Google";
    if (itCompanies.includes(companyToCheck)) {
      console.log(companyToCheck);
    } else {
      console.log("Company is not found");
    }
    ```

14. Filter out companies which have more than one 'o' without the filter method
    - Lọc ra các công ty có nhiều hơn một chữ 'o' mà không dùng phương thức filter
    ```js
    let companiesWithMultipleOs = [];
    for (let company of itCompanies) {
      let count = (company.toLowerCase().match(/o/g) || []).length;
      if (count > 1) {
        companiesWithMultipleOs.push(company);
      }
    }
    console.log(companiesWithMultipleOs); // Output: ["Facebook", "Google"]
    ```

15. Sort the array using _sort()_ method
    - Sắp xếp mảng bằng phương thức _sort()_
    ```js
    console.log(itCompanies.sort());
    ```

16. Reverse the array using _reverse()_ method
    - Đảo ngược mảng bằng phương thức _reverse()_
    ```js
    console.log(itCompanies.reverse());
    ```

17. Slice out the first 3 companies from the array
    - Cắt ra 3 công ty đầu tiên từ mảng
    ```js
    console.log(itCompanies.slice(0, 3));
    ```

18. Slice out the last 3 companies from the array
    - Cắt ra 3 công ty cuối cùng từ mảng
    ```js
    console.log(itCompanies.slice(-3));
    ```

19. Slice out the middle IT company or companies from the array
    - Cắt ra công ty CNTT ở giữa hoặc các công ty từ mảng
    ```js
    let middleIndex = Math.floor(itCompanies.length / 2);
    console.log(itCompanies.length % 2 === 0
      ? itCompanies.slice(middleIndex - 1, middleIndex + 1)
      : itCompanies.slice(middleIndex, middleIndex + 1));
    ```

20. Remove the first IT company from the array
    - Xóa công ty CNTT đầu tiên khỏi mảng
    ```js
    itCompanies.shift();
    console.log(itCompanies);
    ```

21. Remove the middle IT company or companies from the array
    - Xóa công ty CNTT ở giữa hoặc các công ty khỏi mảng
    ```js
    let midIndex = Math.floor(itCompanies.length / 2);
    if (itCompanies.length % 2 === 0) {
      itCompanies.splice(midIndex - 1, 2);
    } else {
      itCompanies.splice(midIndex, 1);
    }
    console.log(itCompanies);
    ```

22. Remove the last IT company from the array
    - Xóa công ty CNTT cuối cùng khỏi mảng
    ```js
    itCompanies.pop();
    console.log(itCompanies);
    ```

23. Remove all IT companies
    - Xóa tất cả các công ty CNTT
    ```js
    itCompanies.length = 0;
    console.log(itCompanies);
    ```

##### Exercise: Level 2

1. Create a separate countries.js file and store the countries array into this file, create a separate file web_techs.js and store the webTechs array into this file. Access both file in main.js file
   - Tạo một tệp countries.js riêng biệt và lưu mảng countries vào tệp này, tạo một tệp web_techs.js riêng biệt và lưu mảng webTechs vào tệp này. Truy cập cả hai tệp trong tệp main.js
   ```js
   // countries.js
   const countries = ['Albania', 'Bolivia', 'Canada', 'Denmark', 'Ethiopia', 'Finland', 'Germany', 'Hungary', 'Ireland', 'Japan', 'Kenya'];
   export { countries };

   // web_techs.js
   const webTechs = ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'Node', 'MongoDB'];
   export { webTechs };

   // main.js
   import { countries } from './countries.js';
   import { webTechs } from './web_techs.js';
   console.log(countries);
   console.log(webTechs);
   ```

2. First remove all the punctuations and change the string to array and count the number of words in the array
   - Đầu tiên, loại bỏ tất cả các dấu câu và chuyển chuỗi thành mảng, sau đó đếm số lượng từ trong mảng
   ```js
   let text = 'I love teaching and empowering people. I teach HTML, CSS, JS, React, Python.';
   let words = text.replace(/[.,]/g, '').split(' ');
   console.log(words);
   console.log(words.length); // Output: ["I", "love", "teaching", "and", "empowering", "people", "I", "teach", "HTML", "CSS", "JS", "React", "Python"], 13
   ```

3. In the following shopping cart add, remove, edit items
   - Trong giỏ hàng sau, thêm, xóa, chỉnh sửa các mặt hàng
   ```js
   const shoppingCart = ['Milk', 'Coffee', 'Tea', 'Honey'];
   // add 'Meat' in the beginning of your shopping cart if it has not been already added
   // thêm 'Meat' vào đầu giỏ hàng nếu nó chưa được thêm
   if (!shoppingCart.includes('Meat')) {
     shoppingCart.unshift('Meat');
   }
   // add Sugar at the end of you shopping cart if it has not been already added
   // thêm Sugar vào cuối giỏ hàng nếu nó chưa được thêm
   if (!shoppingCart.includes('Sugar')) {
     shoppingCart.push('Sugar');
   }
   // remove 'Honey' if you are allergic to honey
   // xóa 'Honey' nếu bạn bị dị ứng với mật ong
   let allergicToHoney = true;
   if (allergicToHoney) {
     let index = shoppingCart.indexOf('Honey');
     if (index !== -1) {
       shoppingCart.splice(index, 1);
     }
   }
   // modify Tea to 'Green Tea'
   // chỉnh sửa Tea thành 'Green Tea'
   let teaIndex = shoppingCart.indexOf('Tea');
   if (teaIndex !== -1) {
     shoppingCart[teaIndex] = 'Green Tea';
   }
   console.log(shoppingCart);
   ```

4. In countries array check if 'Ethiopia' exists in the array if it exists print 'ETHIOPIA'. If it does not exist add to the countries list.
   - Trong mảng countries, kiểm tra xem 'Ethiopia' có tồn tại trong mảng không, nếu có in 'ETHIOPIA'. Nếu không, thêm vào danh sách countries.
   ```js
   if (countries.includes('Ethiopia')) {
     console.log('ETHIOPIA');
   } else {
     countries.push('Ethiopia');
   }
   ```

5. In the webTechs array check if Sass exists in the array and if it exists print 'Sass is a CSS preprocess'. If it does not exist add Sass to the array and print the array.
   - Trong mảng webTechs, kiểm tra xem Sass có tồn tại trong mảng không, nếu có in 'Sass is a CSS preprocess'. Nếu không, thêm Sass vào mảng và in mảng.
   ```js
   if (webTechs.includes('Sass')) {
     console.log('Sass is a CSS preprocess');
   } else {
     webTechs.push('Sass');
     console.log(webTechs);
   }
   ```

6. Concatenate the following two variables and store it in a fullStack variable.
   - Nối hai biến sau và lưu vào biến fullStack.
   ```js
   const frontEnd = ['HTML', 'CSS', 'JS', 'React', 'Redux'];
   const backEnd = ['Node', 'Express', 'MongoDB'];
   const fullStack = frontEnd.concat(backEnd);
   console.log(fullStack); // Output: ["HTML", "CSS", "JS", "React", "Redux", "Node", "Express", "MongoDB"]
   ```

##### Exercise: Level 3

1. The following is an array of 10 students ages: `js const ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]`
   - Sort the array and find the min and max age
   - Find the median age (one middle item or two middle items divided by two)
   - Find the average age (all items divided by number of items)
   - Find the range of the ages (max minus min)
   - Compare the value of (min - average) and (max - average), use _abs()_ method
   - Mảng sau là độ tuổi của 10 học sinh: `js const ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]`
   - Sắp xếp mảng và tìm tuổi nhỏ nhất và lớn nhất
   - Tìm tuổi trung vị (một phần tử giữa hoặc trung bình của hai phần tử giữa)
   - Tìm tuổi trung bình (tổng các phần tử chia cho số lượng phần tử)
   - Tìm khoảng cách độ tuổi (max trừ min)
   - So sánh giá trị của (min - trung bình) và (max - trung bình), sử dụng phương thức _abs()_
   ```js
   const ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24];
   // Sort and find min, max
   let sortedAges = [...ages].sort((a, b) => a - b);
   let minAge = sortedAges[0];
   let maxAge = sortedAges[sortedAges.length - 1];
   console.log("Min age:", minAge, "Max age:", maxAge);
   // Median age
   let mid = Math.floor(sortedAges.length / 2);
   let median = sortedAges.length % 2 === 0
     ? (sortedAges[mid - 1] + sortedAges[mid]) / 2
     : sortedAges[mid];
   console.log("Median age:", median);
   // Average age
   let average = ages.reduce((sum, age) => sum + age, 0) / ages.length;
   console.log("Average age:", average);
   // Range
   let range = maxAge - minAge;
   console.log("Range:", range);
   // Compare min-average and max-average
   console.log("Abs(min - average):", Math.abs(minAge - average));
   console.log("Abs(max - average):", Math.abs(maxAge - average));
   ```

2. Slice the first ten countries from the [countries array](https://github.com/Asabeneh/30DaysOfJavaScript/tree/master/data/countries.js)
   - Cắt 10 quốc gia đầu tiên từ [mảng countries](https://github.com/Asabeneh/30DaysOfJavaScript/tree/master/data/countries.js)
   ```js
   console.log(countries.slice(0, 10));
   ```

3. Find the middle country(ies) in the [countries array](https://github.com/Asabeneh/30DaysOfJavaScript/tree/master/data/countries.js)
   - Tìm quốc gia ở giữa trong [mảng countries](https://github.com/Asabeneh/30DaysOfJavaScript/tree/master/data/countries.js)
   ```js
   let middleCountryIndex = Math.floor(countries.length / 2);
   let middleCountries = countries.length % 2 === 0
     ? countries.slice(middleCountryIndex - 1, middleCountryIndex + 1)
     : countries.slice(middleCountryIndex, middleCountryIndex + 1);
   console.log(middleCountries);
   ```

4. Divide the countries array into two equal arrays if it is even. If countries array is not even, one more country for the first half.
   - Chia mảng countries thành hai mảng bằng nhau nếu số lượng là chẵn. Nếu mảng countries không chẵn, thêm một quốc gia cho nửa đầu.
   ```js
   let half = Math.ceil(countries.length / 2);
   let firstHalf = countries.slice(0, half);
   let secondHalf = countries.slice(half);
   console.log("First half:", firstHalf);
   console.log("Second half:", secondHalf);
   ```

### 4. Conditionals

Conditional statements are used for make decisions based on different conditions.
By default , statements in JavaScript script executed sequentially from top to bottom. If the processing logic require so, the sequential flow of execution can be altered in two ways:

- Conditional execution: a block of one or more statements will be executed if a certain expression is true
- Repetitive execution: a block of one or more statements will be repetitively executed as long as a certain expression is true. In this section, we will cover _if_, _else_ , _else if_ statements. The comparison and logical operators we learned in the previous sections will be useful in here.

Conditions can be implementing using the following ways:

- if
- if else
- if else if else
- switch
- ternary operator

#### If

In JavaScript and other programming languages the key word _if_ is to used check if a condition is true and to execute the block code. To create an if condition, we need _if_ keyword, condition inside a parenthesis and block of code inside a curly bracket({}).

```js
// syntax
if (condition) {
  //this part of code runs for truthy condition
}
```

**Example:**

```js
let num = 3
if (num > 0) {
  console.log(`${num} is a positive number`)
}
//  3 is a positive number
```

As you can see in the condition example above, 3 is greater than 0, so it is a positive number. The condition was true and the block of code was executed. However, if the condition is false, we won't see any results.

```js
let isRaining = true
if (isRaining) {
  console.log('Remember to take your rain coat.')
}
```

The same goes for the second condition, if isRaining is false the if block will not be executed and we do not see any output. In order to see the result of a falsy condition, we should have another block, which is going to be _else_.

#### If Else

If condition is true the first block will be executed, if not the else condition will be executed.

```js
// syntax
if (condition) {
  // this part of code runs for truthy condition
} else {
  // this part of code runs for false condition
}
```

```js
let num = 3
if (num > 0) {
  console.log(`${num} is a positive number`)
} else {
  console.log(`${num} is a negative number`)
}
//  3 is a positive number

num = -3
if (num > 0) {
  console.log(`${num} is a positive number`)
} else {
  console.log(`${num} is a negative number`)
}
//  -3 is a negative number
```

```js
let isRaining = true
if (isRaining) {
  console.log('You need a rain coat.')
} else {
  console.log('No need for a rain coat.')
}
// You need a rain coat.

isRaining = false
if (isRaining) {
  console.log('You need a rain coat.')
} else {
  console.log('No need for a rain coat.')
}
// No need for a rain coat.
```

The last condition is false, therefore the else block was executed. What if we have more than two conditions? In that case, we would use _else if_ conditions.

#### If Else if Else

On our daily life, we make decisions on daily basis. We make decisions not by checking one or two conditions instead we make decisions based on multiple conditions. As similar to our daily life, programming is also full of conditions. We use _else if_ when we have multiple conditions.

```js
// syntax
if (condition) {
  // code
} else if (condition) {
  // code
} else {
  //  code
}
```

**Example:**

```js
let a = 0
if (a > 0) {
  console.log(`${a} is a positive number`)
} else if (a < 0) {
  console.log(`${a} is a negative number`)
} else if (a == 0) {
  console.log(`${a} is zero`)
} else {
  console.log(`${a} is not a number`)
}
```

```js
// if else if else
let weather = 'sunny'
if (weather === 'rainy') {
  console.log('You need a rain coat.')
} else if (weather === 'cloudy') {
  console.log('It might be cold, you need a jacket.')
} else if (weather === 'sunny') {
  console.log('Go out freely.')
} else {
  console.log('No need for rain coat.')
}
```

#### Switch

Switch is an alternative for **if else if else else**.
The switch statement starts with a _switch_ keyword followed by a parenthesis and code block. Inside the code block we will have different cases. Case block runs if the value in the switch statement parenthesis matches with the case value. The break statement is to terminate execution so the code execution does not go down after the condition is satisfied. The default block runs if all the cases don't satisfy the condition.

```js
switch (caseValue) {
  case 1:
    // code
    break
  case 2:
    // code
    break
  case 3:
  // code
  default:
  // code
}
```

```js
let weather = 'cloudy'
switch (weather) {
  case 'rainy':
    console.log('You need a rain coat.')
    break
  case 'cloudy':
    console.log('It might be cold, you need a jacket.')
    break
  case 'sunny':
    console.log('Go out freely.')
    break
  default:
    console.log(' No need for rain coat.')
}

// Switch More Examples
let dayUserInput = prompt('What day is today ?')
let day = dayUserInput.toLowerCase()

switch (day) {
  case 'monday':
    console.log('Today is Monday')
    break
  case 'tuesday':
    console.log('Today is Tuesday')
    break
  case 'wednesday':
    console.log('Today is Wednesday')
    break
  case 'thursday':
    console.log('Today is Thursday')
    break
  case 'friday':
    console.log('Today is Friday')
    break
  case 'saturday':
    console.log('Today is Saturday')
    break
  case 'sunday':
    console.log('Today is Sunday')
    break
  default:
    console.log('It is not a week day.')
}
```

// Examples to use conditions in the cases

```js
let num = prompt('Enter number')
switch (true) {
  case num > 0:
    console.log('Number is positive')
    break
  case num == 0:
    console.log('Numbers is zero')
    break
  case num < 0:
    console.log('Number is negative')
    break
  default:
    console.log('Entered value was not a number')
}
```

#### Ternary Operators

Ternary operator is very common in _React_. It is a short way to write if else statement. In React we use ternary operator in many cases.

To generalize, ternary operator is another way to write conditionals.

```js
let isRaining = true
isRaining
  ? console.log('You need a rain coat.')
  : console.log('No need for a rain coat.')
```
### 💻 Exercises

##### Exercises: Level 1

1. Get user input using prompt(“Enter your age:”). If user is 18 or older, give feedback: 'You are old enough to drive' but if not 18 give another feedback stating to wait for the number of years he needs to turn 18.
   - Nhập tuổi của người dùng bằng prompt(“Enter your age:”). Nếu người dùng từ 18 tuổi trở lên, đưa ra phản hồi: 'Bạn đủ tuổi để lái xe' nhưng nếu dưới 18 tuổi, đưa ra phản hồi khác yêu cầu chờ số năm cần thiết để đủ 18 tuổi.
   ```js
   let age = prompt("Enter your age:");
   age = parseInt(age);
   if (age >= 18) {
     console.log("You are old enough to drive.");
   } else {
     console.log(`You are left with ${18 - age} years to drive.`);
   }
   ```

2. Compare the values of myAge and yourAge using if … else. Based on the comparison and log the result to console stating who is older (me or you). Use prompt(“Enter your age:”) to get the age as input.
   - So sánh giá trị của myAge và yourAge bằng if … else. Dựa trên so sánh, in kết quả ra console để nói ai lớn tuổi hơn (tôi hay bạn). Sử dụng prompt(“Enter your age:”) để lấy tuổi làm đầu vào.
   ```js
   let myAge = 25; // Assuming my age is 25
   let yourAge = prompt("Enter your age:");
   yourAge = parseInt(yourAge);
   if (yourAge > myAge) {
     console.log(`You are ${yourAge - myAge} years older than me.`);
   } else if (yourAge < myAge) {
     console.log(`I am ${myAge - yourAge} years older than you.`);
   } else {
     console.log("We are the same age.");
   }
   ```

3. If a is greater than b return 'a is greater than b' else 'a is less than b'. Try to implement it in two ways
   - Nếu a lớn hơn b, trả về 'a is greater than b' nếu không thì 'a is less than b'. Thử triển khai theo hai cách
     - sử dụng if else
     - toán tử ba ngôi.
   ```js
   let a = 4;
   let b = 3;
   // Using if else
   if (a > b) {
     console.log("a is greater than b");
   } else {
     console.log("a is less than b");
   }
   // Using ternary operator
   console.log(a > b ? "a is greater than b" : "a is less than b");
   ```

4. Even numbers are divisible by 2 and the remainder is zero. How do you check, if a number is even or not using JavaScript?
   - Số chẵn chia hết cho 2 và phần dư bằng 0. Làm thế nào để kiểm tra một số là chẵn hay không bằng JavaScript?
   ```js
   let number = prompt("Enter a number:");
   number = parseInt(number);
   if (number % 2 === 0) {
     console.log(`${number} is an even number`);
   } else {
     console.log(`${number} is an odd number`);
   }
   ```

##### Exercises: Level 2

1. Write a code which can give grades to students according to their scores:
   - 80-100, A
   - 70-89, B
   - 60-69, C
   - 50-59, D
   - 0-49, F
   - Viết mã để chấm điểm cho học sinh dựa trên điểm số của họ:
     - 80-100, A
     - 70-89, B
     - 60-69, C
     - 50-59, D
     - 0-49, F
   ```js
   let score = prompt("Enter your score:");
   score = parseInt(score);
   let grade;
   if (score >= 80 && score <= 100) {
     grade = "A";
   } else if (score >= 70 && score <= 89) {
     grade = "B";
   } else if (score >= 60 && score <= 69) {
     grade = "C";
   } else if (score >= 50 && score <= 59) {
     grade = "D";
   } else if (score >= 0 && score <= 49) {
     grade = "F";
   } else {
     grade = "Invalid score";
   }
   console.log(`Your grade is ${grade}`);
   ```

2. Check if the season is Autumn, Winter, Spring or Summer. If the user input is:
   - September, October or November, the season is Autumn.
   - December, January or February, the season is Winter.
   - March, April or May, the season is Spring
   - June, July or August, the season is Summer
   - Kiểm tra xem mùa là Thu, Đông, Xuân hay Hè. Nếu người dùng nhập:
     - Tháng Chín, Tháng Mười hoặc Tháng Mười Một, mùa là Thu.
     - Tháng Mười Hai, Tháng Một hoặc Tháng Hai, mùa là Đông.
     - Tháng Ba, Tháng Tư hoặc Tháng Năm, mùa là Xuân
     - Tháng Sáu, Tháng Bảy hoặc Tháng Tám, mùa là Hè
   ```js
   let month = prompt("Enter a month:").toLowerCase();
   let season;
   if (["september", "october", "november"].includes(month)) {
     season = "Autumn";
   } else if (["december", "january", "february"].includes(month)) {
     season = "Winter";
   } else if (["march", "april", "may"].includes(month)) {
     season = "Spring";
   } else if (["june", "july", "august"].includes(month)) {
     season = "Summer";
   } else {
     season = "Invalid month";
   }
   console.log(`The season is ${season}`);
   ```

3. Check if a day is weekend day or a working day. Your script will take day as an input.
   - Kiểm tra xem một ngày là ngày cuối tuần hay ngày làm việc. Mã của bạn sẽ nhận ngày làm đầu vào.
   ```js
   let day = prompt("What is the day today?").toLowerCase();
   let isWeekend = ["saturday", "sunday"].includes(day);
   console.log(`${day.charAt(0).toUpperCase() + day.slice(1)} is a ${isWeekend ? "weekend" : "working day"}.`);
   ```

##### Exercises: Level 3

1. Write a program which tells the number of days in a month.
   - Viết chương trình cho biết số ngày trong một tháng.
   ```js
   let month = prompt("Enter a month:").toLowerCase();
   let days;
   switch (month) {
     case "january":
     case "march":
     case "may":
     case "july":
     case "august":
     case "october":
     case "december":
       days = 31;
       break;
     case "april":
     case "june":
     case "september":
     case "november":
       days = 30;
       break;
     case "february":
       days = 28;
       break;
     default:
       days = "Invalid month";
   }
   if (typeof days === "number") {
     console.log(`${month.charAt(0).toUpperCase() + month.slice(1)} has ${days} days.`);
   } else {
     console.log(days);
   }
   ```

2. Write a program which tells the number of days in a month, now consider leap year.
   - Viết chương trình cho biết số ngày trong một tháng, giờ hãy xem xét năm nhuận.
   ```js
   let month = prompt("Enter a month:").toLowerCase();
   let year = prompt("Enter a year:");
   year = parseInt(year);
   let days;
   let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
   switch (month) {
     case "january":
     case "march":
     case "may":
     case "july":
     case "august":
     case "october":
     case "december":
       days = 31;
       break;
     case "april":
     case "june":
     case "september":
     case "november":
       days = 30;
       break;
     case "february":
       days = isLeapYear ? 29 : 28;
       break;
     default:
       days = "Invalid month";
   }
   if (typeof days === "number") {
     console.log(`${month.charAt(0).toUpperCase() + month.slice(1)} has ${days} days.`);
   } else {
     console.log(days);
   }
   ```

### 5. Loops

In programming we use different loops to carry out repetitive tasks. Therefore, loop can help us to automate tedious and repetitive task. JavaScript has also different types of loops which we can use to work on repetitive task.

Imagine if your are asked to print Hello world one thousand times without a loop, it may take an hour or two to do this tedious task. However, using loop we can print it in less than a second.

Loops:

- for
- while
- do while
- for of
- forEach
- for in

A loop usually goes until the condition gets false. But sometimes we like to interrupt the loop or skip an item during iteration. We use _break_ to interrupt the loop and _continue_ to skip an item during iteration.

#### Types of Loops

##### 1. for

We use for loop when we know how many iteration we go. Let's see the following example

```js
// for loop syntax

for (initialization, condition, increment/decrement) {
    code goes here
}
```

This code prints from 0 to 5.

```js
for (let i = 0; i < 6; i++) {
  console.log(i)
}
```

For example if we want to sum all the numbers from 0 to 100.

```js
let sum = 0
for (let i = 0; i < 101; i++) {
  sum += i
}

console.log(sum)
```

If we want to sum only even numbers:

```js
let sum = 0
for (let i = 0; i < 101; i += 2) {
  sum += i
}

console.log(sum)

// or another way

let total = 0
for (let i = 0; i < 101; i++) {
  if (i % 2 == 0) {
    total += i
  }
}
console.log(total)
```

This code iterates through the array

```js
const nums = [1, 2, 3, 4, 5]
for (let i = 0; i < 6; i++) {
  console.log(nums[i])
}
```

This code prints 5 to 0. Looping in reverse order

```js
for (let i = 5; i >= 0; i--) {
  console.log(i)
}
```

The Code below can reverse an array.

```js
const nums = [1, 2, 3, 4, 5]
const lastIndex = nums.length - 1
const newArray = []
for (let i = lastIndex; i >= 0; i--) {
  newArray.push(nums[i])
}

console.log(newArray)
```

##### 2. while

We use the while loop when we do not know how man iteration we go in advance.

```js
let count = prompt('Enter a positive number: ')
while (count > 0) {
  console.log(count)
  count--
}
```

##### 3. do while

Do while run at least once if the condition is true or false

```js
let count = 0
do {
  console.log(count)
  count++
} while (count < 11)
```

The code below runs ones though the condition is false

```js
let count = 11
do {
  console.log(count)
  count++
} while (count < 11)
```

While loop is the least important loop in many programming languages.

##### 4. for of

The for of loop is very handy to use it with array. If we are not interested in the index of the array a for of loop is preferable to regular for loop or forEach loop.

```js
const numbers = [1, 2, 3, 4, 5]
for (const number of numbers) {
  console.log(number)
}

const countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland']
for (const country of countries) {
  console.log(country.toUpperCase())
}
```

##### 5. forEach

If we are interested in the index of the array forEach is preferable to for of loop. The forEach array method takes a callback function, the callback function takes three arguments: the item, the index and the array itself.

```js
const numbers = [1, 2, 3, 4, 5]
numbers.forEach((number, i) => {
  console.log(number, i)
})

const countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland']
countries.forEach((country, i, arr) => {
  console.log(i, country.toUpperCase())
})
```

##### 6. for in

The for in loop can be used with object literals to get the keys of the object.

```js
const user = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  skills: ['HTML', 'CSS', 'JS', 'React', 'Node', 'Python', 'D3.js'],
}

for (const key in user) {
  console.log(key, user[key])
}
```

#### Interrupting a loop and skipping an item

##### break

Break is used to interrupt a loop.

```js
for (let i = 0; i <= 5; i++) {
  if (i == 3) {
    break
  }
  console.log(i)
}

// 0 1 2
```

The above code stops if 3 found in the iteration process.

##### continue

We use the keyword continue to skip a certain iterations.

```js
for (let i = 0; i <= 5; i++) {
  if (i == 3) {
    continue
  }
  console.log(i)
}
// 0 1 2 4 5
```

#### Conclusions

- Regular for loop can be used anywhere when the number of iteration is known.
- While loop when the number of iteration is not know
- Do while loop and while loop are almost the same but do while loop run at least once even when the condition is false
- for of is used only for array
- forEach is used for array
- for in is used for object

### 6. Scope

Variable is the fundamental part in programming. We declare variable to store different data types. To declare a variable we use the key word _var_, _let_ and _const_. A variable can declared at different scope. In this section we will see the scope, scope of variables when we use var or let.
Variables scopes can be:

- Window
- Global
- Local

Variable can be declared globally or locally or window scope. We will see both global and local scope.
Anything declared without let, var or const is scoped at window level.

Let us image we have a scope.js file.

#### Window Scope

Without using console.log() open your browser and check, you will see the value of a and b if you write a or b on the browser. That means a and b are already available in the window.

```js
//scope.js
a = 'JavaScript' // is a window scope this found anywhere
b = 10 // this is a window scope variable
function letsLearnScope() {
  console.log(a, b)
  if (true) {
    console.log(a, b)
  }
}
console.log(a, b) // accessible
```

#### Global scope

A globally declared variable can be accessed every where in the same file. But the term global is relative. It can be global to the file or it can be global relative to some block of codes.

```js
//scope.js
let a = 'JavaScript' // is a global scope it will be found anywhere in this file
let b = 10 // is a global scope it will be found anywhere in this file
function letsLearnScope() {
  console.log(a, b) // JavaScript 10, accessible
  if (true) {
    let a = 'Python'
    let b = 100
    console.log(a, b) // Python 100
  }
  console.log(a, b)
}
letsLearnScope()
console.log(a, b) // JavaScript 10, accessible
```

#### Local scope

A variable declared as local can be accessed only in certain block code.

```js
//scope.js
let a = 'JavaScript' // is a global scope it will be found anywhere in this file
let b = 10 // is a global scope it will be found anywhere in this file
function letsLearnScope() {
  console.log(a, b) // JavaScript 10, accessible
  let c = 30
  if (true) {
    // we can access from the function and outside the function but
    // variables declared inside the if will not be accessed outside the if block
    let a = 'Python'
    let b = 20
    let d = 40
    console.log(a, b, c) // Python 20 30
  }
  // we can not access c because c's scope is only the if block
  console.log(a, b) // JavaScript 10
}
letsLearnScope()
console.log(a, b) // JavaScript 10, accessible
```

Now, you have an understanding of scope. A variable declared with _var_ only scoped to function but variable declared with _let_ or _const_ is block scope(function block, if block, loop etc). Block in JavaScript is a code in between two curly brackets ({}).

```js
//scope.js
function letsLearnScope() {
  var gravity = 9.81
  console.log(gravity)
}
// console.log(gravity), Uncaught ReferenceError: gravity is not defined

if (true) {
  var gravity = 9.81
  console.log(gravity) // 9.81
}
console.log(gravity) // 9.81

for (var i = 0; i < 3; i++) {
  console.log(i) // 1, 2, 3
}
console.log(i)
```

In ES6 and above there is _let_ and _const_, so you will not suffer from the sneakiness of _var_. When we use _let_ our variable is block scoped and it will not infect other parts of our code.

```js
//scope.js
function letsLearnScope() {
  // you can use let or const, but gravity is constant I prefer to use const
  const gravity = 9.81
  console.log(gravity)
}
// console.log(gravity), Uncaught ReferenceError: gravity is not defined

if (true) {
  const gravity = 9.81
  console.log(gravity) // 9.81
}
// console.log(gravity), Uncaught ReferenceError: gravity is not defined

for (let i = 0; i < 3; i++) {
  console.log(i) // 1, 2, 3
}
// console.log(i), Uncaught ReferenceError: gravity is not defined
```

The scope _let_ and _const_ is the same. The difference is only reassigning. We can not change or reassign the value of const variable. I would strongly suggest you to use _let_ and _const_, by using _let_ and _const_ you will writ clean code and avoid hard to debug mistakes. As a rule of thumb, you can use _let_ for any value which change, _const_ for any constant value, and for array, object, arrow function and function expression.

### 7. Object

Everything can be an object and objects do have properties and properties have values, so an object is a key value pair. The order of the key is not reserved, or there is no order.
To create an object literal, we use two curly brackets.

#### Creating an empty object

An empty object

```js
const person = {}
```

#### Creating an objecting with values

Now, the person object has firstName, lastName, age, location, skills and isMarried properties. The value of properties or keys could be a string, number, boolean, an object, null, undefined or a function.

Let us see some examples of object. Each key has a value in the object.

```js
const rectangle = {
  length: 20,
  width: 20,
}
console.log(rectangle) // {length: 20, width: 20}

const person = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  city: 'Helsinki',
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node',
    'MongoDB',
    'Python',
    'D3.js',
  ],
  isMarried: true,
}
console.log(person)
```

#### Getting values from an object

We can access values of object using two methods:

- using . followed by key name if the key-name is a one word
- using square bracket and a quote

```js
const person = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  city: 'Helsinki',
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node',
    'MongoDB',
    'Python',
    'D3.js',
  ],
  getFullName: function () {
    return `${this.firstName}${this.lastName}`
  },
  'phone number': '+3584545454545',
}

// accessing values using .
console.log(person.firstName)
console.log(person.lastName)
console.log(person.age)
console.log(person.location)

// value can be accessed using square bracket and key name
console.log(person['firstName'])
console.log(person['lastName'])
console.log(person['age'])
console.log(person['age'])
console.log(person['location'])

// for instance to access the phone number we only use the square bracket method
console.log(person['phone number'])
```

#### Creating object methods

Now, the person object has getFullName properties. The getFullName is function inside the person object and we call it an object method. The _this_ key word refers to the object itself. We can use the word _this_ to access the values of different properties of the object. We can not use an arrow function as object method because the word this refers to the window inside an arrow function instead of the object itself. Example of object:

```js
const person = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  city: 'Helsinki',
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node',
    'MongoDB',
    'Python',
    'D3.js',
  ],
  getFullName: function () {
    return `${this.firstName} ${this.lastName}`
  },
}

console.log(person.getFullName())
// Asabeneh Yetayeh
```

#### Setting new key for an object

An object is a mutable data structure and we can modify the content of an object after it gets created.

Setting a new keys in an object

```js
const person = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  city: 'Helsinki',
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node',
    'MongoDB',
    'Python',
    'D3.js',
  ],
  getFullName: function () {
    return `${this.firstName} ${this.lastName}`
  },
}
person.nationality = 'Ethiopian'
person.country = 'Finland'
person.title = 'teacher'
person.skills.push('Meteor')
person.skills.push('SasS')
person.isMarried = true

person.getPersonInfo = function () {
  let skillsWithoutLastSkill = this.skills
    .slice(0, this.skills.length - 1)
    .join(', ')
  let lastSkill = this.skills.slice(this.skills.length - 1)[0]

  let skills = `${skillsWithoutLastSkill}, and ${lastSkill}`
  let fullName = this.getFullName()
  let statement = `${fullName} is a ${this.title}.\nHe lives in ${this.country}.\nHe teaches ${skills}.`
  return statement
}
console.log(person)
console.log(person.getPersonInfo())
```

```sh
Asabeneh Yetayeh is a teacher.
He lives in Finland.
He teaches HTML, CSS, JavaScript, React, Node, MongoDB, Python, D3.js, Meteor, and SasS.
```

#### Object Methods

There are different methods to manipulate an object. Let us see some of the available methods.

_Object.assign_: To copy an object without modifying the original object

```js
const person = {
  firstName: 'Asabeneh',
  age: 250,
  country: 'Finland',
  city: 'Helsinki',
  skills: ['HTML', 'CSS', 'JS'],
  title: 'teacher',
  address: {
    street: 'Heitamienkatu 16',
    pobox: 2002,
    city: 'Helsinki',
  },
  getPersonInfo: function () {
    return `I am ${this.firstName} and I live in ${this.city}, ${this.country}. I am ${this.age}.`
  },
}

//Object methods: Object.assign, Object.keys, Object.values, Object.entries
//hasOwnProperty

const copyPerson = Object.assign({}, person)
console.log(copyPerson)
```

##### Getting object keys using Object.keys()

_Object.keys_: To get the keys or properties of an object as an array

```js
const keys = Object.keys(copyPerson)
console.log(keys) //['name', 'age', 'country', 'skills', 'address', 'getPersonInfo']
const address = Object.keys(copyPerson.address)
console.log(address) //['street', 'pobox', 'city']
```

##### Getting object values using Object.values()

_Object.values_:To get values of an object as an array

```js
const values = Object.values(copyPerson)
console.log(values)
```

##### Getting object keys and values using Object.entries()

_Object.entries_:To get the keys and values in an array

```js
const entries = Object.entries(copyPerson)
console.log(entries)
```

##### Checking properties using hasOwnProperty()

_hasOwnProperty_: To check if a specific key or property exist in an object

```js
console.log(copyPerson.hasOwnProperty('name'))
console.log(copyPerson.hasOwnProperty('score'))
```

🌕 You are astonishing. Now, you are super charged with the power of objects. You have just completed day 8 challenges and you are 8 steps a head into your way to greatness. Now do some exercises for your brain and for your muscle.
### 💻 Exercises

##### Exercises: Level 1

1. Create an empty object called dog
   - Tạo một đối tượng rỗng có tên là dog
   ```js
   let dog = {};
   ```

2. Print the dog object on the console
   - In đối tượng dog ra console
   ```js
   console.log(dog);
   ```

3. Add name, legs, color, age and bark properties for the dog object. The bark property is a method which return _woof woof_
   - Thêm các thuộc tính name, legs, color, age và bark cho đối tượng dog. Thuộc tính bark là một phương thức trả về _woof woof_
   ```js
   dog.name = "Buddy";
   dog.legs = 4;
   dog.color = "Brown";
   dog.age = 3;
   dog.bark = function() {
     return "woof woof";
   };
   ```

4. Get name, legs, color, age and bark value from the dog object
   - Lấy giá trị name, legs, color, age và bark từ đối tượng dog
   ```js
   console.log(dog.name); // Buddy
   console.log(dog.legs); // 4
   console.log(dog.color); // Brown
   console.log(dog.age); // 3
   console.log(dog.bark()); // woof woof
   ```

5. Set new properties the dog object: breed, getDogInfo
   - Thiết lập các thuộc tính mới cho đối tượng dog: breed, getDogInfo
   ```js
   dog.breed = "Golden Retriever";
   dog.getDogInfo = function() {
     return `${this.name} is a ${this.age}-year-old ${this.color} ${this.breed} with ${this.legs} legs.`;
   };
   console.log(dog.getDogInfo()); // Buddy is a 3-year-old Brown Golden Retriever with 4 legs.
   ```

##### Exercises: Level 2

1. Find the person who has many skills in the users object.
   - Tìm người có nhiều kỹ năng nhất trong đối tượng users.
   ```js
   const users = {
     Alex: {
       email: 'alex@alex.com',
       skills: ['HTML', 'CSS', 'JavaScript'],
       age: 20,
       isLoggedIn: false,
       points: 30
     },
     Asab: {
       email: 'asab@asab.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'Redux', 'MongoDB', 'Express', 'React', 'Node'],
       age: 25,
       isLoggedIn: false,
       points: 50
     },
     Brook: {
       email: 'daniel@daniel.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux'],
       age: 30,
       isLoggedIn: true,
       points: 50
     },
     Daniel: {
       email: 'daniel@alex.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'Python'],
       age: 20,
       isLoggedIn: false,
       points: 40
     },
     John: {
       email: 'john@john.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'Node.js'],
       age: 20,
       isLoggedIn: true,
       points: 50
     },
     Thomas: {
       email: 'thomas@thomas.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'React'],
       age: 20,
       isLoggedIn: false,
       points: 40
     },
     Paul: {
       email: 'paul@paul.com',
       skills: ['HTML', 'CSS', 'JavaScript', 'MongoDB', 'Express', 'React', 'Node'],
       age: 20,
       isLoggedIn: false,
       points: 40
     }
   };
   let maxSkills = 0;
   let mostSkilledPerson = '';
   for (let user in users) {
     if (users[user].skills.length > maxSkills) {
       maxSkills = users[user].skills.length;
       mostSkilledPerson = user;
     }
   }
   console.log(`${mostSkilledPerson} has the most skills: ${users[mostSkilledPerson].skills}`);
   ```

2. Count logged in users, count users having greater than equal to 50 points from the following object.
   - Đếm số người dùng đã đăng nhập, đếm số người dùng có điểm lớn hơn hoặc bằng 50 từ đối tượng sau.
   ```js
   let loggedInCount = 0;
   let highPointsCount = 0;
   for (let user in users) {
     if (users[user].isLoggedIn) {
       loggedInCount++;
     }
     if (users[user].points >= 50) {
       highPointsCount++;
     }
   }
   console.log(`Logged in users: ${loggedInCount}`);
   console.log(`Users with 50 or more points: ${highPointsCount}`);
   ```

3. Find people who are MERN stack developer from the users object
   - Tìm những người là lập trình viên MERN stack từ đối tượng users
   ```js
   const mernStack = ['MongoDB', 'Express', 'React', 'Node'];
   let mernDevelopers = [];
   for (let user in users) {
     if (mernStack.every(skill => users[user].skills.includes(skill))) {
       mernDevelopers.push(user);
     }
   }
   console.log('MERN stack developers:', mernDevelopers);
   ```

4. Set your name in the users object without modifying the original users object
   - Thêm tên của bạn vào đối tượng users mà không sửa đổi đối tượng users gốc
   ```js
   const newUsers = { ...users, You: { email: 'you@you.com', skills: ['HTML', 'CSS'], age: 25, isLoggedIn: true, points: 60 } };
   console.log(newUsers.You);
   ```

5. Get all keys or properties of users object
   - Lấy tất cả các khóa hoặc thuộc tính của đối tượng users
   ```js
   console.log(Object.keys(users));
   ```

6. Get all the values of users object
   - Lấy tất cả các giá trị của đối tượng users
   ```js
   console.log(Object.values(users));
   ```

7. Use the countries object to print a country name, capital, populations and languages.
   - Sử dụng đối tượng countries để in tên quốc gia, thủ đô, dân số và ngôn ngữ.
   ```js
   const countries = {
     Vietnam: {
       name: 'Vietnam',
       capital: 'Hanoi',
       population: 97338579,
       languages: ['Vietnamese']
     }
   };
   for (let country in countries) {
     console.log(`Country: ${countries[country].name}, Capital: ${countries[country].capital}, Population: ${countries[country].population}, Languages: ${countries[country].languages.join(', ')}`);
   }
   ```

##### Exercises: Level 3

1. Create an object literal called _personAccount_. It has _firstName, lastName, incomes, expenses_ properties and it has _totalIncome, totalExpense, accountInfo, addIncome, addExpense_ and _accountBalance_ methods. Incomes is a set of incomes and its description and expenses is a set of incomes and its description.
   - Tạo một đối tượng literal có tên _personAccount_. Nó có các thuộc tính _firstName, lastName, incomes, expenses_ và các phương thức _totalIncome, totalExpense, accountInfo, addIncome, addExpense_ và _accountBalance_. Incomes là tập hợp các khoản thu nhập và mô tả của chúng, expenses là tập hợp các khoản chi tiêu và mô tả của chúng.
   ```js
   const personAccount = {
     firstName: 'John',
     lastName: 'Doe',
     incomes: [],
     expenses: [],
     totalIncome() {
       return this.incomes.reduce((total, income) => total + income.amount, 0);
     },
     totalExpense() {
       return this.expenses.reduce((total, expense) => total + expense.amount, 0);
     },
     accountInfo() {
       return `${this.firstName} ${this.lastName}'s account: Total Income: ${this.totalIncome()}, Total Expense: ${this.totalExpense()}, Balance: ${this.accountBalance()}`;
     },
     addIncome(amount, description) {
       this.incomes.push({ amount, description });
     },
     addExpense(amount, description) {
       this.expenses.push({ amount, description });
     },
     accountBalance() {
       return this.totalIncome() - this.totalExpense();
     }
   };
   personAccount.addIncome(1000, 'Salary');
   personAccount.addExpense(300, 'Rent');
   console.log(personAccount.accountInfo());
   ```

2. Imagine you are getting the above users collection from a MongoDB database.
   a. Create a function called signUp which allows user to add to the collection. If user exists, inform the user that he has already an account.
   b. Create a function called signIn which allows user to sign in to the application
   - Giả sử bạn nhận được bộ sưu tập users từ cơ sở dữ liệu MongoDB.
     a. Tạo một hàm có tên signUp cho phép người dùng thêm vào bộ sưu tập. Nếu người dùng đã tồn tại, thông báo rằng người dùng đã có tài khoản.
     b. Tạo một hàm có tên signIn cho phép người dùng đăng nhập vào ứng dụng.
   ```js
   const users = [
     {
       _id: 'ab12ex',
       username: 'Alex',
       email: 'alex@alex.com',
       password: '123123',
       createdAt: '08/01/2020 9:00 AM',
       isLoggedIn: false,
     },
     {
       _id: 'fg12cy',
       username: 'Asab',
       email: 'asab@asab.com',
       password: '123456',
       createdAt: '08/01/2020 9:30 AM',
       isLoggedIn: true,
     },
     {
       _id: 'zwf8md',
       username: 'Brook',
       email: 'brook@brook.com',
       password: '123111',
       createdAt: '08/01/2020 9:45 AM',
       isLoggedIn: true,
     },
     {
       _id: 'eefamr',
       username: 'Martha',
       email: 'martha@martha.com',
       password: '123222',
       createdAt: '08/01/2020 9:50 AM',
       isLoggedIn: false,
     },
     {
       _id: 'ghderc',
       username: 'Thomas',
       email: 'thomas@thomas.com',
       password: '123333',
       createdAt: '08/01/2020 10:00 AM',
       isLoggedIn: false,
     },
   ];

   function signUp(_id, username, email, password, createdAt) {
     if (users.some(user => user.email === email)) {
       return "User already has an account.";
     }
     users.push({ _id, username, email, password, createdAt, isLoggedIn: false });
     return "User signed up successfully.";
   }

   function signIn(email, password) {
     const user = users.find(user => user.email === email && user.password === password);
     if (user) {
       user.isLoggedIn = true;
       return `User ${user.username} signed in successfully.`;
     }
     return "Invalid email or password.";
   }

   console.log(signUp('xyz123', 'NewUser', 'newuser@new.com', '123456', '09/12/2025 10:00 AM'));
   console.log(signIn('alex@alex.com', '123123'));
   ```

3. The products array has three elements and each of them has six properties.
   a. Create a function called rateProduct which rates the product
   b. Create a function called averageRating which calculate the average rating of a product
   - Mảng products có ba phần tử và mỗi phần tử có sáu thuộc tính.
     a. Tạo một hàm có tên rateProduct để đánh giá sản phẩm
     b. Tạo một hàm có tên averageRating để tính trung bình điểm đánh giá của sản phẩm
   ```js
   const products = [
     {
       _id: 'eedfcf',
       name: 'mobile phone',
       description: 'Huawei Honor',
       price: 200,
       ratings: [
         { userId: 'fg12cy', rate: 5 },
         { userId: 'zwf8md', rate: 4.5 },
       ],
       likes: [],
     },
     {
       _id: 'aegfal',
       name: 'Laptop',
       description: 'MacPro: System Darwin',
       price: 2500,
       ratings: [],
       likes: ['fg12cy'],
     },
     {
       _id: 'hedfcg',
       name: 'TV',
       description: 'Smart TV:Procaster',
       price: 400,
       ratings: [{ userId: 'fg12cy', rate: 5 }],
       likes: ['fg12cy'],
     },
   ];

   function rateProduct(productId, userId, rate) {
     const product = products.find(p => p._id === productId);
     if (product) {
       product.ratings.push({ userId, rate });
       return `Rated ${product.name} with ${rate} by user ${userId}`;
     }
     return "Product not found.";
   }

   function averageRating(productId) {
     const product = products.find(p => p._id === productId);
     if (product && product.ratings.length > 0) {
       const total = product.ratings.reduce((sum, rating) => sum + rating.rate, 0);
       return total / product.ratings.length;
     }
     return 0;
   }

   console.log(rateProduct('eedfcf', 'ghderc', 4));
   console.log(averageRating('eedfcf'));
   ```

4. Create a function called likeProduct. This function will helps to like to the product if it is not liked and remove like if it was liked.
   - Tạo một hàm có tên likeProduct. Hàm này sẽ giúp thích sản phẩm nếu chưa được thích và xóa lượt thích nếu đã thích.
   ```js
   function likeProduct(productId, userId) {
     const product = products.find(p => p._id === productId);
     if (product) {
       if (product.likes.includes(userId)) {
         product.likes = product.likes.filter(id => id !== userId);
         return `User ${userId} unliked ${product.name}`;
       } else {
         product.likes.push(userId);
         return `User ${userId} liked ${product.name}`;
       }
     }
     return "Product not found.";
   }

   console.log(likeProduct('eedfcf', 'fg12cy'));
   ```
### 8. Functions

So far we have seen many builtin JavaScript functions. In this section, we will focus on custom functions. What is a function? Before we start making functions, lets understand what function is and why we need function?

A function is a reusable block of code or programming statements designed to perform a certain task.
A function is declared by a function key word followed by a name, followed by parentheses (). A parentheses can take a parameter. If a function take a parameter it will be called with argument. A function can also take a default parameter. To store a data to a function, a function has to return certain data types. To get the value we call or invoke a function.
Function makes code:

- clean and easy to read
- reusable
- easy to test

A function can be declared or created in couple of ways:

- _Declaration function_
- _Expression function_
- _Anonymous function_
- _Arrow function_

#### Function Declaration

Let us see how to declare a function and how to call a function.

```js
//declaring a function without a parameter
function functionName() {
  // code goes here
}
functionName() // calling function by its name and with parentheses
```

#### Function without a parameter and return

Function can be declared without a parameter.

**Example:**

```js
// function without parameter,  a function which make a number square
function square() {
  let num = 2
  let sq = num * num
  console.log(sq)
}

square() // 4

// function without parameter
function addTwoNumbers() {
  let numOne = 10
  let numTwo = 20
  let sum = numOne + numTwo

  console.log(sum)
}

addTwoNumbers() // a function has to be called by its name to be executed
```

```js
function printFullName() {
  let firstName = 'Asabeneh'
  let lastName = 'Yetayeh'
  let space = ' '
  let fullName = firstName + space + lastName
  console.log(fullName)
}

printFullName() // calling a function
```

#### Function returning value

Function can also return values, if a function does not return values the value of the function is undefined. Let us write the above functions with return. From now on, we return value to a function instead of printing it.

```js
function printFullName() {
  let firstName = 'Asabeneh'
  let lastName = 'Yetayeh'
  let space = ' '
  let fullName = firstName + space + lastName
  return fullName
}
console.log(printFullName())
```

```js
function addTwoNumbers() {
  let numOne = 2
  let numTwo = 3
  let total = numOne + numTwo
  return total
}

console.log(addTwoNumbers())
```

#### Function with a parameter

In a function we can pass different data types(number, string, boolean, object, function) as a parameter.

```js
// function with one parameter
function functionName(parm1) {
  //code goes her
}
functionName(parm1) // during calling or invoking one argument needed

function areaOfCircle(r) {
  let area = Math.PI * r * r
  return area
}

console.log(areaOfCircle(10)) // should be called with one argument

function square(number) {
  return number * number
}

console.log(square(10))
```

#### Function with two parameters

```js
// function with two parameters
function functionName(parm1, parm2) {
  //code goes her
}
functionName(parm1, parm2) // during calling or invoking two arguments needed
// Function without parameter doesn't take input, so lets make a function with parameters
function sumTwoNumbers(numOne, numTwo) {
  let sum = numOne + numTwo
  console.log(sum)
}
sumTwoNumbers(10, 20) // calling functions
// If a function doesn't return it doesn't store data, so it should return

function sumTwoNumbers(numOne, numTwo) {
  let sum = numOne + numTwo
  return sum
}

console.log(sumTwoNumbers(10, 20))
function printFullName(firstName, lastName) {
  return `${firstName} ${lastName}`
}
console.log(printFullName('Asabeneh', 'Yetayeh'))
```

#### Function with many parameters

```js
// function with multiple parameters
function functionName(parm1, parm2, parm3,...){
  //code goes here
}
functionName(parm1,parm2,parm3,...) // during calling or invoking three arguments needed


// this function takes array as a parameter and sum up the numbers in the array
function sumArrayValues(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
const numbers = [1, 2, 3, 4, 5];
    //calling a function
console.log(sumArrayValues(numbers));


    const areaOfCircle = (radius) => {
      let area = Math.PI * radius * radius;
      return area;
    }
console.log(areaOfCircle(10))

```

#### Function with unlimited number of parameters

Sometimes we do not know how many arguments the user going to pass. Therefore, we should know how to write a function which can take unlimited number of arguments. The way we do it has a significant difference between a function declaration(regular function) and arrow function. Let us see examples both in function declaration and arrow function.

##### Unlimited number of parameters in regular function

A function declaration provides a function scoped arguments array like object. Any thing we passed as argument in the function can be accessed from arguments object inside the functions. Let us see an example

```js
// Let us access the arguments object
​
function sumAllNums() {
 console.log(arguments)
}

sumAllNums(1, 2, 3, 4))
// Arguments(4) [1, 2, 3, 4, callee: ƒ, Symbol(Symbol.iterator): ƒ]

```

```js
// function declaration
​
function sumAllNums() {
  let sum = 0
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i]
  }
  return sum
}

console.log(sumAllNums(1, 2, 3, 4)) // 10
console.log(sumAllNums(10, 20, 13, 40, 10))  // 93
console.log(sumAllNums(15, 20, 30, 25, 10, 33, 40))  // 173
```

##### Unlimited number of parameters in arrow function

Arrow function does not have the function scoped arguments object. To implement a function which takes unlimited number of arguments in an arrow function we use spread operator followed by any parameter name. Any thing we passed as argument in the function can be accessed as array in the arrow function. Let us see an example

```js
// Let us access the arguments object
​
const sumAllNums = (...args) => {
 // console.log(arguments), arguments object not found in arrow function
 // instead we use an a parameter followed by spread operator
 console.log(args)
}

sumAllNums(1, 2, 3, 4))
// [1, 2, 3, 4]

```

```js
// function declaration
​
const sumAllNums = (...args) => {
  let sum = 0
  for (const element of args) {
    sum += element
  }
  return sum
}

console.log(sumAllNums(1, 2, 3, 4)) // 10
console.log(sumAllNums(10, 20, 13, 40, 10))  // 93
console.log(sumAllNums(15, 20, 30, 25, 10, 33, 40))  // 173
```

#### Anonymous Function

Anonymous function or without name

```js
const anonymousFun = function () {
  console.log(
    'I am an anonymous function and my value is stored in anonymousFun'
  )
}
```

#### Expression Function

Expression functions are anonymous functions. After we create a function without a name and we assign it to a variable. To return a value from the function we should call the variable. Look at the example below.

```js
// Function expression
const square = function (n) {
  return n * n
}

console.log(square(2)) // -> 4
```

#### Self Invoking Functions

Self invoking functions are anonymous functions which do not need to be called to return a value.

```js
;(function (n) {
  console.log(n * n)
})(2) // 4, but instead of just printing if we want to return and store the data, we do as shown below

let squaredNum = (function (n) {
  return n * n
})(10)

console.log(squaredNum)
```

#### Arrow Function

Arrow function is an alternative to write a function, however function declaration and arrow function have some minor differences.

Arrow function uses arrow instead of the keyword _function_ to declare a function. Let us see both function declaration and arrow function.

```js
// This is how we write normal or declaration function
// Let us change this declaration function to an arrow function
function square(n) {
  return n * n
}

console.log(square(2)) // 4

const square = (n) => {
  return n * n
}

console.log(square(2)) // -> 4

// if we have only one line in the code block, it can be written as follows, explicit return
const square = (n) => n * n // -> 4
```

```js
const changeToUpperCase = (arr) => {
  const newArr = []
  for (const element of arr) {
    newArr.push(element.toUpperCase())
  }
  return newArr
}

const countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland']
console.log(changeToUpperCase(countries))

// ["FINLAND", "SWEDEN", "NORWAY", "DENMARK", "ICELAND"]
```

```js
const printFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`
}

console.log(printFullName('Asabeneh', 'Yetayeh'))
```

The above function has only the return statement, therefore, we can explicitly return it as follows.

```js
const printFullName = (firstName, lastName) => `${firstName} ${lastName}`

console.log(printFullName('Asabeneh', 'Yetayeh'))
```

#### Function with default parameters

Sometimes we pass default values to parameters, when we invoke the function if we do not pass an argument the default value will be used. Both function declaration and arrow function can have a default value or values.

```js
// syntax
// Declaring a function
function functionName(param = value) {
  //codes
}

// Calling function
functionName()
functionName(arg)
```

**Example:**

```js
function greetings(name = 'Peter') {
  let message = `${name}, welcome to 30 Days Of JavaScript!`
  return message
}

console.log(greetings())
console.log(greetings('Asabeneh'))
```

```js
function generateFullName(firstName = 'Asabeneh', lastName = 'Yetayeh') {
  let space = ' '
  let fullName = firstName + space + lastName
  return fullName
}

console.log(generateFullName())
console.log(generateFullName('David', 'Smith'))
```

```js
function calculateAge(birthYear, currentYear = 2019) {
  let age = currentYear - birthYear
  return age
}

console.log('Age: ', calculateAge(1819))
```

```js
function weightOfObject(mass, gravity = 9.81) {
  let weight = mass * gravity + ' N' // the value has to be changed to string first
  return weight
}

console.log('Weight of an object in Newton: ', weightOfObject(100)) // 9.81 gravity at the surface of Earth
console.log('Weight of an object in Newton: ', weightOfObject(100, 1.62)) // gravity at surface of Moon
```

Let us see how we write the above functions with arrow functions

```js
// syntax
// Declaring a function
const functionName = (param = value) => {
  //codes
}

// Calling function
functionName()
functionName(arg)
```

**Example:**

```js
const greetings = (name = 'Peter') => {
  let message = name + ', welcome to 30 Days Of JavaScript!'
  return message
}

console.log(greetings())
console.log(greetings('Asabeneh'))
```

```js
const generateFullName = (firstName = 'Asabeneh', lastName = 'Yetayeh') => {
  let space = ' '
  let fullName = firstName + space + lastName
  return fullName
}

console.log(generateFullName())
console.log(generateFullName('David', 'Smith'))
```

```js
const calculateAge = (birthYear, currentYear = 2019) => currentYear - birthYear
console.log('Age: ', calculateAge(1819))
```

```js
const weightOfObject = (mass, gravity = 9.81) => mass * gravity + ' N'

console.log('Weight of an object in Newton: ', weightOfObject(100)) // 9.81 gravity at the surface of Earth
console.log('Weight of an object in Newton: ', weightOfObject(100, 1.62)) // gravity at surface of Moon
```

#### Function declaration versus Arrow function

It will be covered in other time
### 💻 Exercises

##### Exercises: Level 1

1. Declare a function _fullName_ and it takes firstName, lastName as a parameter and it returns your full - name.
   - Khai báo một hàm _fullName_ nhận các tham số firstName, lastName và trả về tên đầy đủ.
   ```js
   function fullName(firstName, lastName) {
     return `${firstName} ${lastName}`;
   }
   console.log(fullName("John", "Doe")); // John Doe
   ```

2. Declare a function _addNumbers_ and it takes two parameters and it returns sum.
   - Khai báo một hàm _addNumbers_ nhận hai tham số và trả về tổng.
   ```js
   function addNumbers(a, b) {
     return a + b;
   }
   console.log(addNumbers(5, 3)); // 8
   ```

3. Area of a circle is calculated as follows: _area = π x r x r_. Write a function which calculates _areaOfCircle_
   - Diện tích hình tròn được tính như sau: _area = π x r x r_. Viết một hàm tính _areaOfCircle_
   ```js
   function areaOfCircle(r) {
     return Math.PI * r * r;
   }
   console.log(areaOfCircle(5)); // 78.53981633974483
   ```

4. Temperature in oC can be converted to oF using this formula: _oF = (oC x 9/5) + 32_. Write a function which convert oC to oF _convertCelciusToFahrenheit_.
   - Nhiệt độ từ oC có thể được chuyển đổi sang oF bằng công thức: _oF = (oC x 9/5) + 32_. Viết một hàm chuyển đổi oC sang oF _convertCelciusToFahrenheit_.
   ```js
   function convertCelciusToFahrenheit(oC) {
     return (oC * 9/5) + 32;
   }
   console.log(convertCelciusToFahrenheit(0)); // 32
   ```

5. Body mass index(BMI) is calculated as follows: _bmi = weight in Kg / (height x height) in m2_. Write a function which calculates _bmi_. BMI is used to broadly define different weight groups in adults 20 years old or older. Check if a person is _underweight, normal, overweight_ or _obese_ based the information given below.
   - The same groups apply to both men and women.
   - _Underweight_: BMI is less than 18.5
   - _Normal weight_: BMI is 18.5 to 24.9
   - _Overweight_: BMI is 25 to 29.9
   - _Obese_: BMI is 30 or more
   - Chỉ số khối cơ thể (BMI) được tính như sau: _bmi = trọng lượng tính bằng Kg / (chiều cao x chiều cao) tính bằng m2_. Viết một hàm tính _bmi_. BMI được dùng để xác định các nhóm cân nặng khác nhau ở người lớn từ 20 tuổi trở lên. Kiểm tra xem một người thuộc nhóm _cân nặng thấp, bình thường, thừa cân_ hay _béo phì_ dựa trên thông tin dưới đây.
     - Các nhóm này áp dụng cho cả nam và nữ.
     - _Cân nặng thấp_: BMI nhỏ hơn 18.5
     - _Cân nặng bình thường_: BMI từ 18.5 đến 24.9
     - _Thừa cân_: BMI từ 25 đến 29.9
     - _Béo phì_: BMI từ 30 trở lên
   ```js
   function calculateBMI(weight, height) {
     const bmi = weight / (height * height);
     let category;
     if (bmi < 18.5) {
       category = "Underweight";
     } else if (bmi >= 18.5 && bmi <= 24.9) {
       category = "Normal weight";
     } else if (bmi >= 25 && bmi <= 29.9) {
       category = "Overweight";
     } else {
       category = "Obese";
     }
     return { bmi: bmi.toFixed(2), category };
   }
   console.log(calculateBMI(70, 1.75)); // { bmi: "22.86", category: "Normal weight" }
   ```

6. Write a function called _checkSeason_, it takes a month parameter and returns the season: Autumn, Winter, Spring or Summer.
   - Viết một hàm có tên _checkSeason_, nhận tham số là tháng và trả về mùa: Thu, Đông, Xuân hoặc Hè.
   ```js
   function checkSeason(month) {
     month = month.toLowerCase();
     if (["september", "october", "november"].includes(month)) {
       return "Autumn";
     } else if (["december", "january", "february"].includes(month)) {
       return "Winter";
     } else if (["march", "april", "may"].includes(month)) {
       return "Spring";
     } else if (["june", "july", "august"].includes(month)) {
       return "Summer";
     } else {
       return "Invalid month";
     }
   }
   console.log(checkSeason("January")); // Winter
   ```

##### Exercises: Level 2

1. Quadratic equation is calculated as follows: _ax2 + bx + c = 0_. Write a function which calculates value or values of a quadratic equation, _solveQuadEquation_.
   - Phương trình bậc hai được tính như sau: _ax2 + bx + c = 0_. Viết một hàm tính giá trị hoặc các giá trị của phương trình bậc hai, _solveQuadEquation_.
   ```js
   function solveQuadEquation(a = 0, b = 0, c = 0) {
     if (a === 0 && b === 0 && c === 0) return [0];
     if (a === 0) return [-c / b];
     const discriminant = b * b - 4 * a * c;
     if (discriminant < 0) return [];
     if (discriminant === 0) return [-b / (2 * a)];
     const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
     const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
     return [x1, x2];
   }
   console.log(solveQuadEquation()); // [0]
   console.log(solveQuadEquation(1, 4, 4)); // [-2]
   console.log(solveQuadEquation(1, -1, -2)); // [2, -1]
   console.log(solveQuadEquation(1, 7, 12)); // [-3, -4]
   console.log(solveQuadEquation(1, 0, -4)); // [2, -2]
   console.log(solveQuadEquation(1, -1, 0)); // [1, 0]
   ```

2. Declare a function name _printArray_. It takes array as a parameter and it prints out each value of the array.
   - Khai báo một hàm có tên _printArray_. Nhận mảng làm tham số và in ra từng giá trị của mảng.
   ```js
   function printArray(arr) {
     arr.forEach(item => console.log(item));
   }
   printArray([1, 2, 3]); // 1, 2, 3
   ```

3. Write a function name _showDateTime_ which shows time in this format: 08/01/2020 04:08 using the Date object.
   - Viết một hàm có tên _showDateTime_ hiển thị thời gian theo định dạng: 08/01/2020 04:08 bằng đối tượng Date.
   ```js
   function showDateTime() {
     const now = new Date();
     const day = String(now.getDate()).padStart(2, '0');
     const month = String(now.getMonth() + 1).padStart(2, '0');
     const year = now.getFullYear();
     const hours = String(now.getHours()).padStart(2, '0');
     const minutes = String(now.getMinutes()).padStart(2, '0');
     return `${day}/${month}/${year} ${hours}:${minutes}`;
   }
   console.log(showDateTime()); // e.g., 12/09/2025 14:08
   ```

4. Declare a function name _swapValues_. This function swaps value of x to y.
   - Khai báo một hàm có tên _swapValues_. Hàm này hoán đổi giá trị của x thành y.
   ```js
   function swapValues(x, y) {
     let temp = x;
     x = y;
     y = temp;
     return [x, y];
   }
   console.log(swapValues(3, 4)); // [4, 3]
   console.log(swapValues(4, 5)); // [5, 4]
   ```

5. Declare a function name _reverseArray_. It takes array as a parameter and it returns the reverse of the array (don't use method).
   - Khai báo một hàm có tên _reverseArray_. Nhận mảng làm tham số và trả về mảng đảo ngược (không sử dụng phương thức).
   ```js
   function reverseArray(arr) {
     let reversed = [];
     for (let i = arr.length - 1; i >= 0; i--) {
       reversed.push(arr[i]);
     }
     return reversed;
   }
   console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
   console.log(reverseArray(['A', 'B', 'C'])); // ['C', 'B', 'A']
   ```

6. Declare a function name _capitalizeArray_. It takes array as a parameter and it returns the - capitalizedarray.
   - Khai báo một hàm có tên _capitalizeArray_. Nhận mảng làm tham số và trả về mảng đã được viết hoa.
   ```js
   function capitalizeArray(arr) {
     return arr.map(item => typeof item === 'string' ? item.toUpperCase() : item);
   }
   console.log(capitalizeArray(['a', 'b', 'c'])); // ['A', 'B', 'C']
   ```

7. Declare a function name _addItem_. It takes an item parameter and it returns an array after adding the item
   - Khai báo một hàm có tên _addItem_. Nhận tham số là một mục và trả về mảng sau khi thêm mục đó
   ```js
   function addItem(item, arr = []) {
     return [...arr, item];
   }
   console.log(addItem('Apple', ['Banana', 'Orange'])); // ['Banana', 'Orange', 'Apple']
   ```

8. Declare a function name _removeItem_. It takes an index parameter and it returns an array after removing an item
   - Khai báo một hàm có tên _removeItem_. Nhận tham số là chỉ số và trả về mảng sau khi xóa một mục
   ```js
   function removeItem(index, arr) {
     return arr.filter((_, i) => i !== index);
   }
   console.log(removeItem(1, ['Banana', 'Orange', 'Apple'])); // ['Banana', 'Apple']
   ```

9. Declare a function name evensAndOdds. It takes a positive integer as parameter and it counts number of evens and odds in the number.
   - Khai báo một hàm có tên evensAndOdds. Nhận một số nguyên dương làm tham số và đếm số lượng số chẵn và lẻ trong số đó.
   ```js
   function evensAndOdds(num) {
     let evens = 0, odds = 0;
     for (let i = 0; i <= num; i++) {
       i % 2 === 0 ? evens++ : odds++;
     }
     console.log(`The number of odds are ${odds}.`);
     console.log(`The number of evens are ${evens}.`);
   }
   evensAndOdds(100); // The number of odds are 50. The number of evens are 51.
   ```

10. Write a function which takes any number of arguments and return the sum of the arguments
    - Viết một hàm nhận số lượng tham số bất kỳ và trả về tổng của các tham số
    ```js
    function sum(...args) {
      return args.reduce((total, num) => total + num, 0);
    }
    console.log(sum(1, 2, 3)); // 6
    console.log(sum(1, 2, 3, 4)); // 10
    ```

11. Declare a function name _userIdGenerator_. When this function is called it generates seven character id. The function return the id.
    - Khai báo một hàm có tên _userIdGenerator_. Khi hàm này được gọi, nó tạo ra một id gồm bảy ký tự. Hàm trả về id.
    ```js
    function userIdGenerator() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 7; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    }
    console.log(userIdGenerator()); // e.g., 41XTDbE
    ```

##### Exercises: Level 3

1. Declare a function name _userIdGeneratedByUser_. It doesn’t take any parameter but it takes two inputs using prompt(). One of the input is the number of characters and the second input is the number of ids which are supposed to be generated.
   - Khai báo một hàm có tên _userIdGeneratedByUser_. Hàm không nhận tham số nhưng nhận hai đầu vào bằng prompt(). Một đầu vào là số lượng ký tự và đầu vào thứ hai là số lượng id cần được tạo.
   ```js
   function userIdGeneratedByUser() {
     const numChars = parseInt(prompt("Enter number of characters:"));
     const numIds = parseInt(prompt("Enter number of IDs:"));
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let ids = [];
     for (let i = 0; i < numIds; i++) {
       let id = '';
       for (let j = 0; j < numChars; j++) {
         id += characters.charAt(Math.floor(Math.random() * characters.length));
       }
       ids.push(id);
     }
     return ids.join('\n');
   }
   console.log(userIdGeneratedByUser());
   ```

2. Write a function **_generateColors_** which can generate any number of hexa or rgb colors.
   - Viết một hàm **_generateColors_** có thể tạo ra bất kỳ số lượng màu hexa hoặc rgb.
   ```js
   function generateColors(type, num) {
     const hexChars = '0123456789ABCDEF';
     let colors = [];
     for (let i = 0; i < num; i++) {
       if (type === 'hexa') {
         let color = '#';
         for (let j = 0; j < 6; j++) {
           color += hexChars.charAt(Math.floor(Math.random() * 16));
         }
         colors.push(color);
       } else if (type === 'rgb') {
         const r = Math.floor(Math.random() * 256);
         const g = Math.floor(Math.random() * 256);
         const b = Math.floor(Math.random() * 256);
         colors.push(`rgb(${r}, ${g}, ${b})`);
       }
     }
     return colors;
   }
   console.log(generateColors('hexa', 3)); // ['#a3e12f', '#03ed55', '#eb3d2b']
   console.log(generateColors('hexa', 1)); // '#b334ef'
   console.log(generateColors('rgb', 3)); // ['rgb(5, 55, 175)', 'rgb(50, 105, 100)', 'rgb(15, 26, 80)']
   console.log(generateColors('rgb', 1)); // 'rgb(33, 79, 176)'
   ```

3. Call your function _shuffleArray_, it takes an array as a parameter and it returns a shuffled array
   - Gọi hàm của bạn là _shuffleArray_, nhận một mảng làm tham số và trả về một mảng đã được xáo trộn
   ```js
   function shuffleArray(arr) {
     let shuffled = [...arr];
     for (let i = shuffled.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
     }
     return shuffled;
   }
   console.log(shuffleArray([1, 2, 3, 4, 5])); // e.g., [3, 1, 5, 2, 4]
   ```

4. Call your function _factorial_, it takes a whole number as a parameter and it return a factorial of the number
   - Gọi hàm của bạn là _factorial_, nhận một số nguyên làm tham số và trả về giai thừa của số đó
   ```js
   function factorial(n) {
     if (n < 0) return "Invalid input";
     if (n === 0 || n === 1) return 1;
     let result = 1;
     for (let i = 2; i <= n; i++) {
       result *= i;
     }
     return result;
   }
   console.log(factorial(5)); // 120
   ```

5. Call your function _isEmpty_, it takes a parameter and it checks if it is empty or not
   - Gọi hàm của bạn là _isEmpty_, nhận một tham số và kiểm tra xem nó có rỗng hay không
   ```js
   function isEmpty(param) {
     if (param === null || param === undefined) return true;
     if (typeof param === 'string' || Array.isArray(param)) return param.length === 0;
     if (typeof param === 'object') return Object.keys(param).length === 0;
     return false;
   }
   console.log(isEmpty("")); // true
   console.log(isEmpty([])); // true
   console.log(isEmpty({})); // true
   console.log(isEmpty("hello")); // false
   ```

6. Write a function called _average_, it takes an array parameter and returns the average of the items. Check if all the array items are number types. If not give return reasonable feedback.
   - Viết một hàm có tên _average_, nhận một mảng làm tham số và trả về trung bình của các mục. Kiểm tra xem tất cả các mục trong mảng có phải là kiểu số không. Nếu không, trả về phản hồi hợp lý.
   ```js
   function average(arr) {
     if (!arr.every(item => typeof item === 'number')) {
       return "All items must be numbers";
     }
     if (arr.length === 0) return 0;
     return arr.reduce((sum, num) => sum + num, 0) / arr.length;
   }
   console.log(average([1, 2, 3, 4, 5])); // 3
   console.log(average([1, '2', 3])); // All items must be numbers
   ```
### 9. Higher Order Function

Higher order functions are functions which take other function as a parameter or return a function as a value. The function passed as a parameter is called callback.

#### Callback

A callback is a function which can be passed as parameter to other function. See the example below.

```js
// a callback function, the function could be any name
const callback = (n) => {
  return n ** 2
}
​
// function take other function as a callback
function cube(callback, n) {
  return callback(n) * n
}
​
console.log(cube(callback, 3))
```

#### Returning function

Higher order functions return function as a value
​

```js
// Higher order function returning an other function
const higherOrder = n => {
  const doSomething = m => {
    const doWhatEver = t => {
      return 2 * n + 3 * m + t
    }
    return doWhatEver
  }
​
  return doSomething
}
console.log(higherOrder(2)(3)(10))
```

Let us see were we use call back functions.For instance the _forEach_ method uses call back.

```js
const numbers = [1, 2, 3, 4]
const sumArray = arr => {
  let sum = 0
  const callback = function(element) {
    sum += element
  }
  arr.forEach(callback)
  return sum

}
console.log(sumArray(numbers))
```

```sh
10
```

The above example can be simplified as follows:

```js
const numbers = [1, 2, 3, 4]
​
const sumArray = arr => {
  let sum = 0
  arr.forEach(function(element) {
    sum += element
  })
  return sum

}
console.log(sumArray(numbers))
```

```sh
10
```

#### setting time

In JavaScript we can execute some activity on certain interval of time or we can schedule(wait) for sometime to execute some activities.

- setInterval
- setTimeout

##### setInterval

In JavaScript, we use setInterval higher order function to do some activity continuously with in some interval of time. The setInterval global method take a callback function and a duration as a parameter. The duration is in milliseconds and the callback will be always called in that interval of time.

```js
// syntax
function callback() {
  // code goes here
}
setInterval(callback, duration)
```

```js
function sayHello() {
  console.log('Hello')
}
setInterval(sayHello, 2000) // it prints hello in every 2 seconds
```

##### setTimeout

In JavaScript, we use setTimeout higher order function to execute some action at some time in the future. The setTimeout global method take a callback function and a duration as a parameter. The duration is in milliseconds and the callback wait for that amount of time.

```js
// syntax
function callback() {
  // code goes here
}
setTimeout(callback, duration) // duration in milliseconds
```

```js
function sayHello() {
  console.log('Hello')
}
setTimeout(sayHello, 2000) // it prints hello after it waits for 2 seconds.
```

### 10. Destructuring and Spreading

#### What is Destructuring?

Destructuring is a way to unpack arrays, and objects and assigning to a distinct variable. Destructuring allows us to write clean and readable code.

#### What can we destructure?

1. Arrays
2. Objects

##### 1. Destructuring arrays

Arrays are a list of different data types ordered by their index. Let's see an example of arrays:

```js
const numbers = [1, 2, 3]
const countries = ['Finland', 'Sweden', 'Norway']
```

We can access an item from an array using a certain index by iterating through the loop or manually as shown in the example below.

Accessing array items using a loop

```js
for (const number of numbers) {
  console.log(number)
}

for (const country of countries) {
  console.log(country)
}
```

Accessing array items manually

```js
const numbers = [1, 2, 3]
let num1 = numbers[0]
let num2 = numbers[1]
let num3 = numbers[2]
console.log(num1, num2, num3) // 1, 2, 3

const countries = ['Finland', 'Sweden', 'Norway']
let fin = countries[0]
let swe = countries[1]
let nor = countries[2]
console.log(fin, swe, nor) // Finland, Sweden, Norway
```

Most of the time the size of an array is big and we use a loop to iterate through each item of the arrays. Sometimes, we may have short arrays. If the array size is very short it is ok to access the items manually as shown above but today we will see a better way to access the array item which is destructuring.

Accessing array items using destructuring

```js
const numbers = [1, 2, 3]
const [num1, num2, num3] = numbers
console.log(num1, num2, num3) // 1, 2, 3,

const constants = [2.72, 3.14, 9.81,37, 100]
const [e, pi, gravity, bodyTemp, boilingTemp] = constants
console.log(e, pi, gravity, bodyTemp, boilingTemp]
// 2.72, 3.14, 9.81, 37,100
const countries = ['Finland', 'Sweden', 'Norway']
const [fin, swe, nor] = countries
console.log(fin, swe, nor) // Finland, Sweden, Norway
```

During destructuring each variable should match with the index of the desired item in the array. For instance, the variable fin matches to index 0 and the variable nor matches to index 2. What would be the value of den if you have a variable den next nor?

```js
const [fin, swe, nor, den] = countries
console.log(den) // undefined
```

If you tried the above task you confirmed that the value is undefined. Actually, we can pass a default value to the variable, and if the value of that specific index is undefined the default value will be used.

```js
const countries = ['Finland', 'Sweden', undefined, 'Norway']
const [fin, swe, ice = 'Iceland', nor, den = 'Denmark'] = countries
console.log(fin, swe, ice, nor, den) // Finland, Sweden, Iceland, Norway, Denmark
```

Destructuring Nested arrays

```js
const fullStack = [
  ['HTML', 'CSS', 'JS', 'React'],
  ['Node', 'Express', 'MongoDB']
]

const [frontEnd, backEnd] = fullstack
console.log(frontEnd, backEnd)

//["HTML", "CSS", "JS", "React"] , ["Node", "Express", "MongoDB"]

const fruitsAndVegetables = [['banana', 'orange', 'mango', 'lemon'],  ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot']]

const [fruits, vegetables] = fruitsAndVegetables
console.log(fruits, vegetables]

//['banana', 'orange', 'mango', 'lemon']

//['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot']
```

Skipping an Item during destructuring

During destructuring if we are not interested in every item, we can omit a certain item by putting a comma at that index. Let's get only Finland, Iceland, and Denmark from the array. See the example below for more clarity:

```js
const countries = ['Finland', 'Sweden', 'Iceland', 'Norway', 'Denmark']
const [fin, , ice, , den] = countries
console.log(fin, ice, den) // Finland, Iceland, Denmark
```

Getting the rest of the array using the spread operator
We use three dots(...) to spread or get the rest of an array during destructuring

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const [num1, num2, num3, ...rest] = nums
console.log(num1, num2, num3, rest) //1, 2, 3, [4, 5, 6, 7, 8, 9, 10]

const countries = [
  'Germany',
  'France',
  'Belgium',
  'Finland',
  'Sweden',
  'Norway',
  'Denmark',
  'Iceland',
]

let [gem, fra, , ...nordicCountries] = countries
console.log(gem, fra, nordicCountries)
// Germany, France,  ["Finland", "Sweden", "Norway", "Denmark", "Iceland"]
```

There many cases in which we use array destructuring, let's see the following example:

Destructuring when we loop through arrays

```js
const countries = [
  ['Finland', 'Helsinki'],
  ['Sweden', 'Stockholm'],
  ['Norway', 'Oslo'],
]

for (const [country, city] of countries) {
  console.log(country, city)
}

const fullStack = [
  ['HTML', 'CSS', 'JS', 'React'],
  ['Node', 'Express', 'MongoDB'],
]

for (const [first, second, third, fourth] of fullStack) {
  console.log(first, second, third, fourt)
}
```

What do you think about the code snippet below? If you have started React Hooks already it may remind you of the useState hook.

```js
const [x, y] = [2, (value) => value ** 2]
```

What is the value of x? And what is the value of y(x)? I leave this for you to figure out.

If you have used react hooks you are very familiar with this and as you may imagine it is destructuring. The initial value of count is 0 and the setCount is a method that changes the value of count.

```js
const [count, setCount] = useState(0)
```

Now, you know how to destructure arrays. Let's move on to destructuring objects.

##### 2. Destructuring objects

An object literal is made of key and value pairs. A very simple example of an object:

```js
const rectangle = {
  width: 20,
  height: 10,
}
```

We access the value of an object using the following methods:

```js
const rectangle = {
  width: 20,
  height: 10,
}

let width = rectangle.width
let height = recangle.height

// or

let width = rectangle[width]
let height = recangle[height]
```

But today, we will see how to access the value of an object using destructuring.

When we destructure an object the name of the variable should be exactly the same as the key or property of the object. See the example below.

```js
const rectangle = {
  width: 20,
  height: 10,
}

let { width, height } = rectangle
console.log(width, height, perimeter) // 20, 10
```

What will be the value of we try to access a key which not in the object.

```js
const rectangle = {
  width: 20,
  height: 10,
}

let { width, height, perimeter } = rectangleconsole.log(
  width,
  height,
  perimeter
) // 20, 10, undefined
```

The value of the perimeter in the above example is undefined.

Default value during object destructuring

Similar to the array, we can also use a default value in object destructuring.

```js
const rectangle = {
  width: 20,
  height: 10,
}

let { width, height, perimeter = 200 } = rectangle
console.log(width, height, perimeter) // 20, 10, undefined
```

Renaming variable names

```js
const rectangle = {
  width: 20,
  height: 10,
}

let { width: w, height: h } = rectangle
```

Let's also destructure, nested objects. In the example below, we have nested objects and we can destructure it in two ways.

We can just destructure step by step

```js
const props = {
  user:{
    firstName:'Asabeneh',
    lastName:'Yetayeh',
    age:250
  },
  post:{
    title:'Destructuring and Spread',
    subtitle:'ES6',
    year:2020
},
skills:['JS', 'React', 'Redux', 'Node', 'Python']

}
}

const {user, post, skills} = props
const {firstName, lastName, age} = user
const {title, subtitle, year} = post
const [skillOne, skillTwo, skillThree, skillFour, skillFive] = skills
```

1. We can destructure it one step

```js
const props = {
  user:{
    firstName:'Asabeneh',
    lastName:'Yetayeh',
    age:250
  },
  post:{
    title:'Destructuring and Spread',
    subtitle:'ES6',
    year:2020
},
skills:['JS', 'React', 'Redux', 'Node', 'Python']

}

}

const {user:{firstName, lastName, age}, post:{title, subtitle, year}, skills:[skillOne, skillTwo, skillThree, skillFour, skillFive]} = props

```

Destructuring during loop through an array

```js
const languages = [
  { lang: 'English', count: 91 },
  { lang: 'French', count: 45 },
  { lang: 'Arabic', count: 25 },
  { lang: 'Spanish', count: 24 },
  { lang: 'Russian', count: 9 },
  { lang: 'Portuguese', count: 9 },
  { lang: 'Dutch', count: 8 },
  { lang: 'German', count: 7 },
  { lang: 'Chinese', count: 5 },
  { lang: 'Swahili', count: 4 },
  { lang: 'Serbian', count: 4 },
]

for (const { lang, count } of languages) {
  console.log(`The ${lang} is spoken in ${count} countries.`)
}
```

Destructuring function parameter

```js
const rectangle = { width: 20, height: 10 }
const calcualteArea = ({ width, height }) => width * height
const calculatePerimeter = ({ width, height } = 2 * (width + height))
```

#### Exercises

Create a function called getPersonInfo. The getPersonInfo function takes an object parameter. The structure of the object and the output of the function is given below. Try to use both a regular way and destructuring and compare the cleanness of the code. If you want to compare your solution with my solution, check this link.

```js
const person = {
  firstName: 'Asabeneh',
  lastName: 'Yetayeh',
  age: 250,
  country: 'Finland',
  job: 'Instructor and Developer',
  skills: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Redux',
    'Node',
    'MongoDB',
    'Python',
    'D3.js',
  ],
  languages: ['Amharic', 'English', 'Suomi(Finnish)'],
}

/*
Asabeneh Yetayeh lives in Finland. He is  250 years old. He is an Instructor and Developer. He teaches HTML, CSS, JavaScript, React, Redux, Node, MongoDB, Python and D3.js. He speaks Amharic, English and a little bit of Suomi(Finnish)
*/
```

#### Spread or Rest Operator

When we destructure an array we use the spread operator(...) to get the rest elements as array. In addition to that we use spread operator to spread arr elements to another array.

##### Spread operator to get the rest of array elements

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let [num1, num2, num3, ...rest] = nums
​
console.log(num1, num2, num3)
console.log(rest)
```

```sh
1 2 3
[4, 5, 6, 7, 8, 9, 10]
```

```js
const countries = [
  'Germany',
  'France',
  'Belgium',
  'Finland',
  'Sweden',
  'Norway',
  'Denmark',
  'Iceland',
]

let [gem, fra, , ...nordicCountries] = countries

console.log(gem)
console.log(fra)
console.log(nordicCountries)
```

```sh
Germany
France
["Finland", "Sweden", "Norway", "Denmark", "Iceland"]
```

##### Spread operator to copy array

```js
const evens = [0, 2, 4, 6, 8, 10]
const evenNumbers = [...evens]

const odds = [1, 3, 5, 7, 9]
const oddNumbers = [...odds]

const wholeNumbers = [...evens, ...odds]

console.log(evenNumbers)
console.log(oddNumbers)
console.log(wholeNumbers)
```

```sh
[0, 2, 4, 6, 8, 10]
[1, 3, 5, 7, 9]
[0, 2, 4, 6, 8, 10, 1, 3, 5, 7, 9]
```

```js
const frontEnd = ['HTML', 'CSS', 'JS', 'React']
const backEnd = ['Node', 'Express', 'MongoDB']
const fullStack = [...frontEnd, ...backEnd]

console.log(fullStack)
```

```sh
["HTML", "CSS", "JS", "React", "Node", "Express", "MongoDB"]
```

##### Spread operator to copy object

We can copy an object using a spread operator

```js
const user = {
  name: 'Asabeneh',
  title: 'Programmer',
  country: 'Finland',
  city: 'Helsinki',
}

const copiedUser = { ...user }
console.log(copiedUser)
```

```sh
{name: "Asabeneh", title: "Programmer", country: "Finland", city: "Helsinki"}
```

Modifying or changing the object while copying

```js
const user = {
  name: 'Asabeneh',
  title: 'Programmer',
  country: 'Finland',
  city: 'Helsinki',
}

const copiedUser = { ...user, title: 'instructor' }
console.log(copiedUser)
```

```sh
{name: "Asabeneh", title: "instructor", country: "Finland", city: "Helsinki"}
```

##### Spread operator with arrow function

Whenever we like to write an arrow function which takes unlimited number of arguments we use a spread operator. If we use a spread operator as a parameter, the argument passed when we invoke a function will change to an array.

```js
const sumAllNums = (...args) => {
  console.log(args)
}

sumAllNums(1, 2, 3, 4, 5)
```

```sh
[1, 2, 3, 4, 5]

```

```js
const sumAllNums = (...args) => {
  let sum = 0
  for (const num of args) {
    sum += num
  }
  return sum
}

console.log(sumAllNums(1, 2, 3, 4, 5))
```

```sh
15

```

### 11. Functional Programming

In this article, I will try to help you to have a very good understanding of the most common feature of JavaScript, _functional programming_.

_Functional programming_ allows you to write shorter code, clean code, and also to solve complicated problems which might be difficult to solve in a traditional way.

In this article we will cover all JS functional programming methods:

- forEach
- map
- filter
- reduce
- find
- findIndex
- some
- every

#### 1. forEach

We use forEach when we like to iterate through an array of items. The forEach is a higher-order function and it takes call-back as a parameter. The forEach method is used only with array and we use forEach if you are interested in each item or index or both.

```js
// syntax in a normal or a function declaration

function callback(item, index, arr) {}
array.forEach(callback)

// or syntax in an arrow function
const callback = (item, i, arr) => {}
array.forEach(callback)
```

The call back function could be a function declaration or an arrow function.

Let see different examples

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']
countries.forEach(function (country, index, arr) {
  console.log(i, country.toUpperCase())
})
```

If there is no much code inside the code block we can use an arrow function and we can write it without a curly bracket. The index and the array parameters are optional, we can omit them.

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']
countries.forEach((country, i) => console.log(i, country.toUpperCase()))
```

```sh
0 "FINLAND"
1 "ESTONIA"
2 "SWEDEN"
3 "NORWAY"
```

For example if we like to change each country to uppercase and store it back to an array we write it as follows.

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']
const newCountries = []
countries.forEach((country) => newCountries.push(country))

console.log(newCountries) // ["Finland", "Estonia", "Sweden", "Norway"]
```

Let us see more examples. For instance if we want to sum an array of numbers we can use forEach or reduce. Let us see how we use forEach to sum all numbers in an array.

```js
const numbers = [1, 2, 3, 4, 5]
let sum = 0
numbers.forEach((n) => (sum += n))

console.log(sum) // 15
```

Let us move to the next functional programming method which is going to be a map.

#### 2. map

We use the map method whenever we like to modify an array. We use the map method only with arrays and it always returns an array.

```js
// syntax in a normal or a function declaration

function callback(item, i) {
  return // code goes here
}

const modifiedArray = array.map(callback)

// or syntax in an arrow function

const callback = (item, i) => {
  return // code goes here
}
const modifiedArray = array.map(callback)
```

Now, let us modify the countries array using the map method. The index is an optional parameter

```js
// Using function declaration

const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']

const newCountries = countries.map(function (country) {
  return country.toUpperCase()
})

console.log(newCountries)

// map using an arrow function call back

const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']
const newCountries = countries.map((country) => country.toUpperCase())

console.log(newCountries) // ["FINLAND", "ESTONIA", "SWEDEN", "NORWAY"]
```

As you can see that map is very handy to modify an array and to get an array back. Now, let us create an array of the length of the countries from the countries array.

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway']
const countriesLength = countries.map((country) => country.length)

console.log(countriesLength) // [7, 7, 6, 6]
```

Let us see another more example

```js
const numbers = [1, 2, 3, 4, 5]
const squares = numbers.map((n) => n ** 2)

console.log(squares) // [1, 4, 9, 16, 25]
```

#### 3. filter

As you may understand from the literal meaning of filter, it filters out items based on some criteria. The filter method like forEach and map is used with an array and it returns an array of the filtered items.

For instance if we want to filter out countries containing a substring land from an array of countries. See the example below:

```js
// syntax in a normal or a function declaration
function callback(item) {
  return // boolean
}

const filteredArray = array.filter(callback)

// or syntax in an arrow function

const callback = (item) => {
  return // boolean
}
const filteredArray = array.filter(callback)
```

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const countriesWithLand = countries.filter((country) =>
  country.includes('land')
)
console.log(countriesWithLand) // ["Finland", "Iceland"]
```

How about if we want to filter out countries not containing the substring land. We use negation to achieve that.

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const countriesWithLand = countries.filter(
  (country) => !country.includes('land')
)
console.log(countriesWithLand) // ["Estonia", "Sweden", "Norway"]
```

Let's see an additional example about the filter, let us filter even or odd numbers from an array of numbers

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const evens = numbers.filter((n) => n % 2 === 0)
const odds = numbers.filter((n) => n % 2 !== 0)
console.log(evens) // [0, 2, 4, 6, 8, 10]
console.log(odds) // [1, 3, 5, 7, 9]
```

Now, you know how to filter let us move on to the next functional programming, reduce.

#### 4. reduce

Like forEach, map, and filter, reduce is also used with an array and it returns a single value. You can associate reduce with a blender. You put different fruits to a blend and you get a mix of fruit juice. The juice is the output from the reduction process.

We use the reduce method to sum all numbers in an array together, or to multiply items in an array or to concatenate items in an array. Let us see the following different example to make this explanation more clear.

```js
// syntax in a normal or a function declaration

function callback(acc, cur) {
    return // code goes here
}

const reduced = array.reduce(callback, optionalInitialValue)

// or syntax in an arrow function

const reduced =  callback(acc, cur) => {
    return // code goes here
}
const reduced = array.reduce(callback)
```

The default initial value is 0. We can change the initial value if we want to change it.

For instance if we want to add all items in an array and if all the items are numbers we can use reduce.

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const sum = numbers.reduce((acc, cur) => acc + cur)
console.log(sum) // 55
```

Reduce has a default initial value which is zero. Now, let us use a different initial value which is 5 in this case.

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const sum = numbers.reduce((acc, cur) => acc + cur, 5)
console.log(sum) // 60
```

Let us concatenate strings using reduce

```js
const strs = ['Hello', 'world', '!']
const helloWorld = strs.reduce((acc, cur) => acc + ' ' + cur)
console.log(helloWorld) // "Hello world !"
```

We can multiply items of an array using reduce and we will return the value.

```js
const numbers = [1, 2, 3, 4, 5]
const value = numbers.reduce((acc, cur) => acc * cur)
console.log(value) // 120
```

Let us try it with an initial value

```js
const numbers = [1, 2, 3, 4, 5]
const value = numbers.reduce((acc, cur) => acc * cur, 10)
console.log(value) // 1200
```

#### 5. find

If we are interested in the first occurrence of a certain item or element in an array we can use find method. Unlike map and filter, find just return the first occurrence of an item instead of an array.

```js
// syntax in a normal or a function declaration

function callback(item) {
return // code goes here
}

const item = array.find(callback)

// or syntax in an arrow function

const reduced =  callback(item) => {
return // code goes here
}
const item = array.find(callback)
```

Let find the first even number and the first odd number in the numbers array.

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const firstEvenNum = numbers.find((n) => n % 2 === 0)
const firstOddNum = numbers.find((n) => n % 2 !== 0)
console.log(firstEvenNum) // 0
console.log(firstOddNum) // 1
```

Let us find the first country which contains a substring way

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const countryWithWay = countries.find((country) => country.includes('way'))
console.log(countriesWithWay) // Norway
```

Let us find the first country which has only six characters

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const sixCharsCountry = countries.find((country) => country.length === 6)
console.log(sixCharsCountry) // Sweden
```

Let us find the first country in the array which has the letter 'o'

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const index = countries.find((country) => country.includes('o'))
console.log(index // Estonia
```

#### 6. findIndex

The findIndex method works like find but findIndex returns the index of the item. If we are interested in the index of a certain item or element in an array we can use findIndex. The findIndex return the index of the first occurrence of an item.

```js
// syntax in a normal or a function declaration

function callback(item) {
return // code goes here
}

const index = array.findIndex(callback)

// or syntax in an arrow function

const reduced =  callback(item) => {
return // code goes here
}
const index = array.findIndex(callback)
```

Let us find the index of the first even number and the index of the first odd number in the numbers array.

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const firstEvenIndex = numbers.findIndex((n) => n % 2 === 0)
const firstOddIndex = numbers.findIndex((n) => n % 2 !== 0)
console.log(firstEvenIndex) // 0
console.log(firstOddIndex) // 1
```

Let us find the index of the first country in the array which has exactly six characters

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const index = countries.findIndex((country) => country.length === 6)
console.log(index //2
```

Let us find the index of the first country in the array which has the letter 'o'.

```js
const countries = ['Finland', 'Estonia', 'Sweden', 'Norway', 'Iceland']
const index = countries.findIndex((country) => country.includes('o'))
console.log(index // 1
```

Let us move on to the next functional programming, some.

#### 7. some

The some method is used with array and return a boolean. If one or some of the items satisfy the criteria the result will be true else it will be false. Let us see it with an example.

In the following array some numbers are even and some are odd, so if I ask you a question, are there even numbers in the array then your answer will be yes. If I ask you also another question, are there odd numbers in the array then your answer will be yes. On the contrary, if I ask you, are all the numbers even or odd then your answer will be no because all the numbers are not even or odd.

```js
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const someAreEvens = numbers.some((n) => n % 2 === 0)
const someAreOdds = numbers.some((n) => n % 2 !== 0)
console.log(someAreEvens) // true
console.log(someAreOdds) // true
```

Let us another example

```js
const evens = [0, 2, 4, 6, 8, 10]
const someAreEvens = evens.some((n) => n % 2 === 0)
const someAreOdds = evens.some((n) => n % 2 !== 0)
console.log(someAreEvens) // true
console.log(someAreOdds) // false
```

Now, let us see one more functional programming, every.

#### 8. every

The method every is somehow similar to some but every item must satisfy the criteria. The method every like some returns a boolean.

```js

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const allAreEvens = numbers.every((n) => n % 2 === 0)
const allAreOdd s= numbers.every((n) => n % 2 !== 0)

console.log(allAreEven) // false
console.log(allAreOdd)  // false

const evens = [0, 2, 4, 6, 8, 10]
const someAreEvens = evens.some((n) => n % 2 === 0)
const someAreOdds = evens.some((n) => n % 2 !== 0)

console.log(someAreEvens) // true
console.log(someAreOdds)  // false
```
#### Exercises

```js
const products = [
  { product: 'banana', price: 3 },
  { product: 'mango', price: 6 },
  { product: 'potato', price: ' ' },
  { product: 'avocado', price: 8 },
  { product: 'coffee', price: 10 },
  { product: 'tea', price: '' },
]
```

1. Print the price of each product using forEach
   - In giá của từng sản phẩm bằng forEach
   ```js
   products.forEach(item => console.log(item.price));
   ```

2. Print the product items as follows using forEach
   - In các mục sản phẩm như sau bằng forEach
   ```sh
   The price of banana is 3 euros.
   The price of mango is 6 euros.
   The price of potato is unknown.
   The price of avocado is 8 euros.
   The price of coffee is 10 euros.
   The price of tea is unknown.
   ```
   ```js
   products.forEach(item => {
     const priceText = item.price && item.price !== ' ' ? `${item.price} euros` : 'unknown';
     console.log(`The price of ${item.product} is ${priceText}.`);
   });
   ```

3. Calculate the sum of all the prices using forEach
   - Tính tổng tất cả các giá bằng forEach
   ```js
   let sum = 0;
   products.forEach(item => {
     if (typeof item.price === 'number') {
       sum += item.price;
     }
   });
   console.log(sum); // 27
   ```

4. Create an array of prices using map and store it in a variable prices
   - Tạo một mảng giá bằng map và lưu vào biến prices
   ```js
   const prices = products.map(item => item.price);
   console.log(prices); // [3, 6, ' ', 8, 10, '']
   ```

5. Filter products with prices
   - Lọc các sản phẩm có giá
   ```js
   const productsWithPrice = products.filter(item => typeof item.price === 'number');
   console.log(productsWithPrice); // [{ product: 'banana', price: 3 }, { product: 'mango', price: 6 }, { product: 'avocado', price: 8 }, { product: 'coffee', price: 10 }]
   ```

6. Use method chaining to get the sum of the prices (map, filter, reduce)
   - Sử dụng chuỗi phương thức để tính tổng giá (map, filter, reduce)
   ```js
   const sumPrices = products
     .map(item => item.price)
     .filter(price => typeof price === 'number')
     .reduce((total, price) => total + price, 0);
   console.log(sumPrices); // 27
   ```

7. Calculate the sum of all the prices using reduce only
   - Tính tổng tất cả các giá chỉ bằng reduce
   ```js
   const sumPricesReduce = products.reduce((total, item) => {
     return typeof item.price === 'number' ? total + item.price : total;
   }, 0);
   console.log(sumPricesReduce); // 27
   ```

8. Find the first product which doesn't have a price value
   - Tìm sản phẩm đầu tiên không có giá trị giá
   ```js
   const noPriceProduct = products.find(item => item.price === '' || item.price === ' ');
   console.log(noPriceProduct); // { product: 'potato', price: ' ' }
   ```

9. Find the index of the first product which does not have price value
   - Tìm chỉ số của sản phẩm đầu tiên không có giá trị giá
   ```js
   const noPriceIndex = products.findIndex(item => item.price === '' || item.price === ' ');
   console.log(noPriceIndex); // 2
   ```

10. Check if some products do not have a price value
    - Kiểm tra xem một số sản phẩm có không có giá trị giá hay không
    ```js
    const hasNoPrice = products.some(item => item.price === '' || item.price === ' ');
    console.log(hasNoPrice); // true
    ```

11. Check if all the products have price value
    - Kiểm tra xem tất cả các sản phẩm có giá trị giá hay không
    ```js
    const allHavePrice = products.every(item => typeof item.price === 'number');
    console.log(allHavePrice); // false
    ```

12. Explain the difference between forEach, map, filter and reduce
    - Giải thích sự khác biệt giữa forEach, map, filter và reduce
    ```js
    // forEach: Loops through each element in an array and performs an action (e.g., logging) without returning a new array.
    // forEach: Duyệt qua từng phần tử trong mảng và thực hiện một hành động (ví dụ: in ra) mà không trả về mảng mới.
    // Example: products.forEach(item => console.log(item.price));

    // map: Creates a new array by applying a function to each element. The original array is unchanged.
    // map: Tạo một mảng mới bằng cách áp dụng một hàm cho từng phần tử. Mảng gốc không thay đổi.
    // Example: const prices = products.map(item => item.price);

    // filter: Creates a new array with elements that pass a test (returns true). The original array is unchanged.
    // filter: Tạo một mảng mới với các phần tử vượt qua kiểm tra (trả về true). Mảng gốc không thay đổi.
    // Example: products.filter(item => typeof item.price === 'number');

    // reduce: Reduces the array to a single value by applying a function to each element, accumulating a result.
    // reduce: Rút gọn mảng thành một giá trị duy nhất bằng cách áp dụng một hàm cho từng phần tử, tích lũy kết quả.
    // Example: products.reduce((total, item) => total + (typeof item.price === 'number' ? item.price : 0), 0);
    ```

13. Explain the difference between filter, find and findIndex
    - Giải thích sự khác biệt giữa filter, find và findIndex
    ```js
    // filter: Returns a new array containing all elements that satisfy the condition.
    // filter: Trả về một mảng mới chứa tất cả các phần tử thỏa mãn điều kiện.
    // Example: products.filter(item => item.price > 5); // Returns all products with price > 5

    // find: Returns the first element that satisfies the condition, or undefined if none found.
    // find: Trả về phần tử đầu tiên thỏa mãn điều kiện, hoặc undefined nếu không tìm thấy.
    // Example: products.find(item => item.price > 5); // Returns { product: 'mango', price: 6 }

    // findIndex: Returns the index of the first element that satisfies the condition, or -1 if none found.
    // findIndex: Trả về chỉ số của phần tử đầu tiên thỏa mãn điều kiện, hoặc -1 nếu không tìm thấy.
    // Example: products.findIndex(item => item.price > 5); // Returns 1
    ```

14. Explain the difference between some and every
    - Giải thích sự khác biệt giữa some và every
    ```js
    // some: Returns true if at least one element in the array satisfies the condition.
    // some: Trả về true nếu ít nhất một phần tử trong mảng thỏa mãn điều kiện.
    // Example: products.some(item => item.price === ''); // true (tea has no price)

    // every: Returns true if all elements in the array satisfy the condition.
    // every: Trả về true nếu tất cả các phần tử trong mảng thỏa mãn điều kiện.
    // Example: products.every(item => typeof item.price === 'number'); // false (some prices are not numbers)
    ```

### 12. Classes

JavaScript is an object oriented programming language. Everything in JavScript is an object, with its properties and methods. We create class to create an object. A Class is like an object constructor, or a "blueprint" for creating objects. We instantiate a class to create an object. The class defines attributes and the behavior of the object, while the object, on the other hand, represents the class.

Once we create a class we can create object from it whenever we want. Creating an object from a class is called class instantiation.

In the object section, we saw how to create an object literal. Object literal is a singleton. If we want to get a similar object , we have to write it. However, class allows to create many objects. This helps to reduce amount of code and repetition of code.

#### Defining a classes

To define a class in JavaScript we need the keyword _class_ , the name of a class in **CamelCase** and block code(two curly brackets). Let us create a class name Person.

```sh
// syntax
class ClassName {
    //  code goes here
}

```

**Example:**

```js
class Person {
  // code goes here
}
```

We have created an Person class but it does not have any thing inside.

#### Class Instantiation

Instantiation class means creating an object from a class. We need the keyword _new_ and we call the name of the class after the word new.

Let us create a dog object from our Person class.

```js
class Person {
  // code goes here
}
const person = new Person()
console.log(person)
```

```sh
Person {}
```

As you can see, we have created a person object. Since the class did not have any properties yet the object is also empty.

Let use the class constructor to pass different properties for the class.

#### Class Constructor

The constructor is a builtin function which allows as to create a blueprint for our object. The constructor function starts with a keyword constructor followed by a parenthesis. Inside the parenthesis we pass the properties of the object as parameter. We use the _this_ keyword to attach the constructor parameters with the class.

The following Person class constructor has firstName and lastName property. These properties are attached to the Person class using _this_ keyword. _This_ refers to the class itself.

```js
class Person {
  constructor(firstName, lastName) {
    console.log(this) // Check the output from here
    this.firstName = firstName
    this.lastName = lastName
  }
}

const person = new Person()

console.log(person)
```

```sh
Person {firstName: undefined, lastName}
```

All the keys of the object are undefined. When ever we instantiate we should pass the value of the properties. Let us pass value at this time when we instantiate the class.

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh')

console.log(person1)
```

```sh
Person {firstName: "Asabeneh", lastName: "Yetayeh"}
```

As we have stated at the very beginning that once we create a class we can create many object using the class. Now, let us create many person objects using the Person class.

```js
class Person {
  constructor(firstName, lastName) {
    console.log(this) // Check the output from here
    this.firstName = firstName
    this.lastName = lastName
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh')
const person2 = new Person('Lidiya', 'Tekle')
const person3 = new Person('Abraham', 'Yetayeh')

console.log(person1)
console.log(person2)
console.log(person3)
```

```sh
Person {firstName: "Asabeneh", lastName: "Yetayeh"}
Person {firstName: "Lidiya", lastName: "Tekle"}
Person {firstName: "Abraham", lastName: "Yetayeh"}
```

Using the class Person we created three persons object. As you can see our class did not many properties let us add more properties to the class.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    console.log(this) // Check the output from here
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')

console.log(person1)
```

```sh
Person {firstName: "Asabeneh", lastName: "Yetayeh", age: 250, country: "Finland", city: "Helsinki"}
```

#### Default values with constructor

The constructor function properties may have a default value like other regular functions.

```js
class Person {
  constructor(
    firstName = 'Asabeneh',
    lastName = 'Yetayeh',
    age = 250,
    country = 'Finland',
    city = 'Helsinki'
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
  }
}

const person1 = new Person() // it will take the default values
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')

console.log(person1)
console.log(person2)
```

```sh
Person {firstName: "Asabeneh", lastName: "Yetayeh", age: 250, country: "Finland", city: "Helsinki"}
Person {firstName: "Lidiya", lastName: "Tekle", age: 28, country: "Finland", city: "Espoo"}
```

#### Class methods

The constructor inside a class is a builtin function which allow us to create a blueprint for the object. In a class we can create class methods. Methods are JavaScript functions inside the class. Let us create some class methods.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')

console.log(person1.getFullName())
console.log(person2.getFullName())
```

```sh
Asabeneh Yetayeh
test.js:19 Lidiya Tekle
```

#### Properties with initial value

When we create a class for some properties we may have an initial value. For instance if you are playing a game, you starting score will be zero. So, we may have a starting score or score which is zero. In other way, we may have an initial skill and we will acquire some skill after some time.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
    this.score = 0
    this.skills = []
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')

console.log(person1.score)
console.log(person2.score)

console.log(person1.skills)
console.log(person2.skills)
```

```sh
0
0
[]
[]
```

A method could be regular method or a getter or a setter. Let us see, getter and setter.

#### getter

The get method allow us to access value from the object. We write a get method using keyword _get_ followed by a function. Instead of accessing properties directly from the object we use getter to get the value. See the example bellow

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
    this.score = 0
    this.skills = []
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
  get getScore() {
    return this.score
  }
  get getSkills() {
    return this.skills
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')

console.log(person1.getScore) // We do not need parenthesis to call a getter method
console.log(person2.getScore)

console.log(person1.getSkills)
console.log(person2.getSkills)
```

```sh
0
0
[]
[]
```

#### setter

The setter method allow us to modify the value of certain properties. We write a setter method using keyword _set_ followed by a function. See the example bellow.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
    this.score = 0
    this.skills = []
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
  get getScore() {
    return this.score
  }
  get getSkills() {
    return this.skills
  }
  set setScore(score) {
    this.score += score
  }
  set setSkill(skill) {
    this.skills.push(skill)
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')

person1.setScore = 1
person1.setSkill = 'HTML'
person1.setSkill = 'CSS'
person1.setSkill = 'JavaScript'

person2.setScore = 1
person2.setSkill = 'Planning'
person2.setSkill = 'Managing'
person2.setSkill = 'Organizing'

console.log(person1.score)
console.log(person2.score)

console.log(person1.skills)
console.log(person2.skills)
```

```sh
1
1
["HTML", "CSS", "JavaScript"]
["Planning", "Managing", "Organizing"]
```

Do not be puzzled by the difference between regular method and a getter. If you know how to make a regular method you are good. Let us add regular method called getPersonInfo in the Person class.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
    this.score = 0
    this.skills = []
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
  get getScore() {
    return this.score
  }
  get getSkills() {
    return this.skills
  }
  set setScore(score) {
    this.score += score
  }
  set setSkill(skill) {
    this.skills.push(skill)
  }
  getPersonInfo() {
    let fullName = this.getFullName()
    let skills =
      this.skills.length > 0 &&
      this.skills.slice(0, this.skills.length - 1).join(', ') +
        ` and ${this.skills[this.skills.length - 1]}`
    let formattedSkills = skills ? `He knows ${skills}` : ''

    let info = `${fullName} is ${this.age}. He lives ${this.city}, ${this.country}. ${formattedSkills}`
    return info
  }
}

const person1 = new Person('Asabeneh', 'Yetayeh', 250, 'Finland', 'Helsinki')
const person2 = new Person('Lidiya', 'Tekle', 28, 'Finland', 'Espoo')
const person3 = new Person('John', 'Doe', 50, 'Mars', 'Mars city')

person1.setScore = 1
person1.setSkill = 'HTML'
person1.setSkill = 'CSS'
person1.setSkill = 'JavaScript'

person2.setScore = 1
person2.setSkill = 'Planning'
person2.setSkill = 'Managing'
person2.setSkill = 'Organizing'

console.log(person1.getScore)
console.log(person2.getScore)

console.log(person1.getSkills)
console.log(person2.getSkills)
console.log(person3.getSkills)

console.log(person1.getPersonInfo())
console.log(person2.getPersonInfo())
console.log(person3.getPersonInfo())
```

```sh
1
1
["HTML", "CSS", "JavaScript"]
["Planning", "Managing", "Organizing"]
[]
Asabeneh Yetayeh is 250. He lives Helsinki, Finland. He knows HTML, CSS and JavaScript
Lidiya Tekle is 28. He lives Espoo, Finland. He knows Planning, Managing and Organizing
John Doe is 50. He lives Mars city, Mars.
```

#### Static method

The static keyword defines a static method for a class. Static methods are not called on instances of the class. Instead, they are called on the class itself. These are often utility functions, such as functions to create or clone objects. An example of static method is _Date.now()_. The _now_ method is called directly from the class.

```js
class Person {
  constructor(firstName, lastName, age, country, city) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.country = country
    this.city = city
    this.score = 0
    this.skills = []
  }
  getFullName() {
    const fullName = this.firstName + ' ' + this.lastName
    return fullName
  }
  get getScore() {
    return this.score
  }
  get getSkills() {
    return this.skills
  }
  set setScore(score) {
    this.score += score
  }
  set setSkill(skill) {
    this.skills.push(skill)
  }
  getPersonInfo() {
    let fullName = this.getFullName()
    let skills =
      this.skills.length > 0 &&
      this.skills.slice(0, this.skills.length - 1).join(', ') +
        ` and ${this.skills[this.skills.length - 1]}`

    let formattedSkills = skills ? `He knows ${skills}` : ''

    let info = `${fullName} is ${this.age}. He lives ${this.city}, ${this.country}. ${formattedSkills}`
    return info
  }
  static favoriteSkill() {
    const skills = ['HTML', 'CSS', 'JS', 'React', 'Python', 'Node']
    const index = Math.floor(Math.random() * skills.length)
    return skills[index]
  }
  static showDateTime() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let date = now.getDate()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }

    let dateMonthYear = date + '.' + month + '.' + year
    let time = hours + ':' + minutes
    let fullTime = dateMonthYear + ' ' + time
    return fullTime
  }
}

console.log(Person.favoriteSkill())
console.log(Person.showDateTime())
```

```sh
Node
15.1.2020 23:56
```

The static methods are methods which can be used as utility functions.

#### Inheritance

Using inheritance we can access all the properties and the methods of the parent class. This reduces repetition of code. If you remember, we have a Person parent class and we will create children from it. Our children class could be student, teach etc.

```js
// syntax
class ChildClassName extends {
 // code goes here
}
```

Let us create a Student child class from Person parent class.

```js
class Student extends Person {
  saySomething() {
    console.log('I am a child of the person class')
  }
}

const s1 = new Student('Asabeneh', 'Yetayeh', 'Finland', 250, 'Helsinki')
console.log(s1)
console.log(s1.saySomething())
console.log(s1.getFullName())
console.log(s1.getPersonInfo())
```

```sh
Student {firstName: "Asabeneh", lastName: "Yetayeh", age: "Finland", country: 250, city: "Helsinki", …}
I am a child of the person class
Asabeneh Yetayeh
Student {firstName: "Asabeneh", lastName: "Yetayeh", age: "Finland", country: 250, city: "Helsinki", …}
Asabeneh Yetayeh is Finland. He lives Helsinki, 250.
```

#### Overriding methods

As you can see, we manage to access all the methods in the Person Class and we used it in the Student child class. We can customize the parent methods, we can add additional properties to a child class. If we want to customize, the methods and if we want to add extra properties, we need to use the constructor function the child class too. In side the constructor function we call the super() function to access all the properties from the parent class. The Person class didn't have gender but now let us give gender property for the child class, Student. If the same method name used in the child class, the parent method will be overridden.

```js
class Student extends Person {
  constructor(firstName, lastName, age, country, city, gender) {
    super(firstName, lastName, age, country, city)
    this.gender = gender
  }

  saySomething() {
    console.log('I am a child of the person class')
  }
  getPersonInfo() {
    let fullName = this.getFullName()
    let skills =
      this.skills.length > 0 &&
      this.skills.slice(0, this.skills.length - 1).join(', ') +
        ` and ${this.skills[this.skills.length - 1]}`

    let formattedSkills = skills ? `He knows ${skills}` : ''
    let pronoun = this.gender == 'Male' ? 'He' : 'She'

    let info = `${fullName} is ${this.age}. ${pronoun} lives in ${this.city}, ${this.country}. ${formattedSkills}`
    return info
  }
}

const s1 = new Student(
  'Asabeneh',
  'Yetayeh',
  250,
  'Finland',
  'Helsinki',
  'Male'
)
const s2 = new Student('Lidiya', 'Tekle', 28, 'Finland', 'Helsinki', 'Female')
s1.setScore = 1
s1.setSkill = 'HTML'
s1.setSkill = 'CSS'
s1.setSkill = 'JavaScript'

s2.setScore = 1
s2.setSkill = 'Planning'
s2.setSkill = 'Managing'
s2.setSkill = 'Organizing'

console.log(s1)

console.log(s1.saySomething())
console.log(s1.getFullName())
console.log(s1.getPersonInfo())

console.log(s2.saySomething())
console.log(s2.getFullName())
console.log(s2.getPersonInfo())
```

```sh
Student {firstName: "Asabeneh", lastName: "Yetayeh", age: 250, country: "Finland", city: "Helsinki", …}
Student {firstName: "Lidiya", lastName: "Tekle", age: 28, country: "Finland", city: "Helsinki", …}
I am a child of the person class
Asabeneh Yetayeh
Student {firstName: "Asabeneh", lastName: "Yetayeh", age: 250, country: "Finland", city: "Helsinki", …}
Asabeneh Yetayeh is 250. He lives in Helsinki, Finland. He knows HTML, CSS and JavaScript
I am a child of the person class
Lidiya Tekle
Student {firstName: "Lidiya", lastName: "Tekle", age: 28, country: "Finland", city: "Helsinki", …}
Lidiya Tekle is 28. She lives in Helsinki, Finland. He knows Planning, Managing and Organizing
```

Now, the getPersonInfo method has been overridden and it identifies if the person is male or female.

#### Exercises

##### Exercises Level 1

1. Create an Animal class. The class will have name, age, color, legs properties and create different methods
   - Tạo một lớp Animal. Lớp này sẽ có các thuộc tính name, age, color, legs và tạo các phương thức khác nhau
   ```js
   class Animal {
     constructor(name, age, color, legs) {
       this.name = name;
       this.age = age;
       this.color = color;
       this.legs = legs;
     }
     makeSound() {
       return `${this.name} makes a sound.`;
     }
     describe() {
       return `${this.name} is a ${this.age}-year-old ${this.color} animal with ${this.legs} legs.`;
     }
   }
   const animal = new Animal("Leo", 5, "Brown", 4);
   console.log(animal.describe()); // Leo is a 5-year-old Brown animal with 4 legs.
   console.log(animal.makeSound()); // Leo makes a sound.
   ```

2. Create a Dog and Cat child class from the Animal Class.
   - Tạo lớp con Dog và Cat từ lớp Animal.
   ```js
   class Dog extends Animal {
     constructor(name, age, color, legs, breed) {
       super(name, age, color, legs);
       this.breed = breed;
     }
     makeSound() {
       return `${this.name} barks: Woof woof!`;
     }
   }
   class Cat extends Animal {
     constructor(name, age, color, legs, breed) {
       super(name, age, color, legs);
       this.breed = breed;
     }
     makeSound() {
       return `${this.name} meows: Meow meow!`;
     }
   }
   const dog = new Dog("Buddy", 3, "Golden", 4, "Golden Retriever");
   const cat = new Cat("Whiskers", 2, "White", 4, "Persian");
   console.log(dog.describe()); // Buddy is a 3-year-old Golden animal with 4 legs.
   console.log(dog.makeSound()); // Buddy barks: Woof woof!
   console.log(cat.describe()); // Whiskers is a 2-year-old White animal with 4 legs.
   console.log(cat.makeSound()); // Whiskers meows: Meow meow!
   ```

##### Exercises Level 2

1. Override the method you create in Animal class
   - Ghi đè phương thức bạn đã tạo trong lớp Animal
   ```js
   class Dog extends Animal {
     constructor(name, age, color, legs, breed) {
       super(name, age, color, legs);
       this.breed = breed;
     }
     // Override makeSound
     makeSound() {
       return `${this.name} barks loudly: WOOF WOOF!`;
     }
     // Override describe
     describe() {
       return `${this.name} is a ${this.age}-year-old ${this.color} ${this.breed} dog with ${this.legs} legs.`;
     }
   }
   class Cat extends Animal {
     constructor(name, age, color, legs, breed) {
       super(name, age, color, legs);
       this.breed = breed;
     }
     // Override makeSound
     makeSound() {
       return `${this.name} purrs softly: Purr purr!`;
     }
     // Override describe
     describe() {
       return `${this.name} is a ${this.age}-year-old ${this.color} ${this.breed} cat with ${this.legs} legs.`;
     }
   }
   const dog = new Dog("Buddy", 3, "Golden", 4, "Golden Retriever");
   const cat = new Cat("Whiskers", 2, "White", 4, "Persian");
   console.log(dog.describe()); // Buddy is a 3-year-old Golden Golden Retriever dog with 4 legs.
   console.log(dog.makeSound()); // Buddy barks loudly: WOOF WOOF!
   console.log(cat.describe()); // Whiskers is a 2-year-old White Persian cat with 4 legs.
   console.log(cat.makeSound()); // Whiskers purrs softly: Purr purr!
   ```

##### Exercises Level 3

1. Let's try to develop a program which calculate measure of central tendency of a sample(mean, median, mode) and measure of variability(range, variance, standard deviation). In addition to those measures find the min, max, count, percentile, and frequency distribution of the sample. You can create a class called Statistics and create all the functions which do statistical calculations as method for the Statistics class.
   - Hãy thử phát triển một chương trình tính toán các thước đo xu hướng trung tâm của một mẫu (trung bình, trung vị, mode) và các thước đo biến thiên (khoảng giá trị, phương sai, độ lệch chuẩn). Ngoài ra, tìm min, max, số lượng, phân vị và phân phối tần số của mẫu. Bạn có thể tạo một lớp có tên Statistics và tạo tất cả các hàm thực hiện các phép tính thống kê như các phương thức của lớp Statistics.

Check the output below.

```JS
ages = [31, 26, 34, 37, 27, 26, 32, 32, 26, 27, 27, 24, 32, 33, 27, 25, 26, 38, 37, 31, 34, 24, 33, 29, 26]

console.log('Count:', statistics.count()) // 25
console.log('Sum: ', statistics.sum()) // 744
console.log('Min: ', statistics.min()) // 24
console.log('Max: ', statistics.max()) // 38
console.log('Range: ', statistics.range() // 14
console.log('Mean: ', statistics.mean()) // 30
console.log('Median: ',statistics.median()) // 29
console.log('Mode: ', statistics.mode()) // {'mode': 26, 'count': 5}
console.log('Variance: ',statistics.var()) // 17.5
console.log('Standard Deviation: ', statistics.std()) // 4.2
console.log('Variance: ',statistics.var()) // 17.5
console.log('Frequency Distribution: ',statistics.freqDist()) // [(20.0, 26), (16.0, 27), (12.0, 32), (8.0, 37), (8.0, 34), (8.0, 33), (8.0, 31), (8.0, 24), (4.0, 38), (4.0, 29), (4.0, 25)]
```

```sh
// you output should look like this
console.log(statistics.describe())
Count: 25
Sum:  744
Min:  24
Max:  38
Range:  14
Mean:  30
Median:  29
Mode:  (26, 5)
Variance:  17.5
Standard Deviation:  4.2
Frequency Distribution: [(20.0, 26), (16.0, 27), (12.0, 32), (8.0, 37), (8.0, 34), (8.0, 33), (8.0, 31), (8.0, 24), (4.0, 38), (4.0, 29), (4.0, 25)]
```
   ```js
   class Statistics {
     constructor(data) {
       this.data = data;
     }
     count() {
       return this.data.length;
     }
     sum() {
       return this.data.reduce((total, num) => total + num, 0);
     }
     min() {
       return Math.min(...this.data);
     }
     max() {
       return Math.max(...this.data);
     }
     range() {
       return this.max() - this.min();
     }
     mean() {
       return Math.round(this.sum() / this.count());
     }
     median() {
       const sorted = [...this.data].sort((a, b) => a - b);
       const mid = Math.floor(sorted.length / 2);
       return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
     }
     mode() {
       const frequency = {};
       this.data.forEach(num => {
         frequency[num] = (frequency[num] || 0) + 1;
       });
       let maxFreq = 0;
       let mode = null;
       for (let num in frequency) {
         if (frequency[num] > maxFreq) {
           maxFreq = frequency[num];
           mode = num;
         }
       }
       return { mode: parseInt(mode), count: maxFreq };
     }
     var() {
       const mean = this.mean();
       const squaredDiffs = this.data.map(num => (num - mean) ** 2);
       return Number((squaredDiffs.reduce((sum, val) => sum + val, 0) / this.count()).toFixed(1));
     }
     std() {
       return Number(Math.sqrt(this.var()).toFixed(1));
     }
     freqDist() {
       const frequency = {};
       this.data.forEach(num => {
         frequency[num] = (frequency[num] || 0) + 1;
       });
       const result = Object.entries(frequency).map(([num, count]) => [
         (count / this.count() * 100).toFixed(1),
         parseInt(num)
       ]);
       return result.sort((a, b) => b[0] - a[0]);
     }
     describe() {
       return `
Count: ${this.count()}
Sum: ${this.sum()}
Min: ${this.min()}
Max: ${this.max()}
Range: ${this.range()}
Mean: ${this.mean()}
Median: ${this.median()}
Mode: (${this.mode().mode}, ${this.mode().count})
Variance: ${this.var()}
Standard Deviation: ${this.std()}
Frequency Distribution: ${JSON.stringify(this.freqDist())}`;
     }
   }

   const ages = [31, 26, 34, 37, 27, 26, 32, 32, 26, 27, 27, 24, 32, 33, 27, 25, 26, 38, 37, 31, 34, 24, 33, 29, 26];
   const statistics = new Statistics(ages);
   console.log(statistics.describe());
   ```
### 13 Document Object Model(DOM)

HTML document is structured as a JavaScript Object. Every HTML element has a different properties which can help us to manipulate it. It is possible to get, create, append or remove HTML elements using JavaScript.

When it comes to React we do not directly manipulate the DOM instead React Virtual DOM will take care of update all necessary changes.

So do not directly manipulate the DOM if you are using react. The only place we directly touch the DOM is here at the index.html. React is a single page application because all the components will be rendered on the index.html page and there will not be any other HTML in the entire React Application. You don't have to know DOM very well to use react but recommended to know.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>

  <body>
    <!-- <div class="root"></div> -->
    <div id="root"></div>

    <script>
      // const root = document.querySelector('.root')
      // const root = document.getElementById('root')
      const root = document.querySelector('#root')
      root.innerHTML = <h1>Welcome to 30 Days Of React </h1>
    </script>
  </body>
</html>
```

[<< Day 0](../readMe.md) | [Day 2 >>](../02_Day_Introduction_to_React/02_introduction_to_react.md)
