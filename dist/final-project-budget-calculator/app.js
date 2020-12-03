// getting the date information, retrived from:
// https://stackoverflow.com/questions/32540044/html-display-current-date
const n =  new Date();
const y = n.getFullYear();
let m = n.getMonth();
const monthArr = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
m = monthArr[m];
const d = n.getDate();

class Transaction{
  constructor(amount, description, id){
    this.amount = amount;
    this.description = description;
    this.date = `${m} ${d}, ${y}`;
    this.id = id;
    this.percentage = 0;
  }
}
// global variable "idIndex" will be used for tracing every transaction.
let idIndex = 0;

class TransactionList{
  constructor(){
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
    this.incomeSum = 0;
    this.expenseSum = 0;
  }

  addNewTransaction(amount,description){
    this.id = idIndex;
    switch(true){
      case amount > 0 : this.incomeList.push(new Transaction(amount, description, idIndex));
      break;
      case amount < 0 : this.expenseList.push(new Transaction(amount, description, idIndex));
      break;
    }
    idIndex ++;
  }

  calculate(){
    let incomeTotal = 0;
    this.incomeList.forEach(item => incomeTotal += parseInt(item.amount));
    this.incomeSum = incomeTotal.toFixed(2);
    let expenseTotal = 0;
    this.expenseList.forEach(item => expenseTotal += parseInt(item.amount));
    this.expenseSum = Math.abs(expenseTotal).toFixed(2);
    this.expenseList.forEach(element => {
      element.percentage = (Math.abs(parseInt(element.amount))/this.incomeSum).toFixed(2)
    });
  }

  removeTransaction(Id){
    if (this.incomeList.find(item => item.id === parseInt(Id))) {
      let index = this.incomeList.findIndex(item => item.id === parseInt(Id));
      this.incomeList.splice(index, 1);
    } else {
      let index = this.expenseList.findIndex(item => item.id === parseInt(Id));
      this.expenseList.splice(index, 1);
    }
  }
}

let descriptionInput = document.getElementsByClassName("add__description");

let valueInput = document.getElementsByClassName("add__value");

let income__list = document.getElementsByClassName("income__list");

let expenses__list = document.getElementsByClassName("expenses__list");

const transactionList = new TransactionList();

class UI{
  static clear(){
    descriptionInput[0].value = "";
    valueInput[0].value = "";
  }

  static renderHTML(){
    income__list[0].innerHTML = "";
    expenses__list[0].innerHTML = "";
    transactionList.incomeList.forEach(item => UI.generateIncomeHTML(item));
    transactionList.expenseList.forEach(item => UI.generateExpenseHTML(item));
  }

  static generateIncomeHTML(item){
    const divElement = document.createElement("div");
    divElement.innerHTML = `
    <div class="item" data-transaction-id="${item.id}">
      <div class="item__description">${item.description}</div>            
      <div class="right">
        <div class="item__value">+ $${parseInt(item.amount).toFixed(2)}</div>
        <div class="item__delete">
          <button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i>
          </button>
        </div>
      </div>
      <div class="item__date">${item.date}</div>
    </div>`;
    income__list[0].append(divElement);
  }

  static generateExpenseHTML(item){
    const divElement = document.createElement("div");
    divElement.innerHTML = `
    <div class="item" data-transaction-id="${item.id}">
      <div class="item__description">${item.description}</div>
        <div class="right">
          <div class="item__value">- $${Math.abs(parseInt(item.amount)).toFixed(2)}</div>
          <div class="item__percentage">${(item.percentage*100).toFixed(0)}%</div>
            <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
      <div class="item__date">${item.date}</div>
    </div>`;
    expenses__list[0].append(divElement);
  }

  static updataHTML(incomeSum, expenseSum){
    let budget__title__month = document.querySelector(".budget__title--month")
    let budget__income__value = document.querySelector(".budget__income--value");
    let budget__expenses__value = document.querySelector(".budget__expenses--value");
    let budget__expenses__percentage = document.querySelector(".budget__expenses--percentage");
    let budget__value = document.querySelector(".budget__value");
    let budget = 0;
    budget = incomeSum - expenseSum;
    budget__title__month.innerHTML = `${m} ${y}`;
    budget__income__value.innerHTML = `+ $${incomeSum}`;
    budget__expenses__value.innerHTML = `- $${expenseSum}`;
    if (incomeSum===0||Boolean(incomeSum)) {
      budget__expenses__percentage.innerHTML = "%";
    } else {
      budget__expenses__percentage.innerHTML = `${((Math.abs(expenseSum)/incomeSum).toFixed(2) * 100).toFixed(0)}%`;
    }
    budget__value.innerHTML = `${budget>=0? "+":"-"} $${Math.abs(budget)}`;
  }
}

UI.clear();
UI.renderHTML();
UI.updataHTML(transactionList.incomeSum,transactionList.expenseSum);

let addButton = document.getElementsByClassName("add__btn");
// add new transaction
addButton[0].addEventListener('click',() => {
  if(descriptionInput[0].value.length !== 0 && parseInt(valueInput[0].value) !== 0){
    transactionList.addNewTransaction(valueInput[0].value, descriptionInput[0].value);
    transactionList.calculate();
    UI.clear();
    UI.renderHTML();
    UI.updataHTML(transactionList.incomeSum,transactionList.expenseSum);
  }else{
    alert("The description or value you typed was invaild! Please type into correct characters!")
    UI.clear();
  }
})
// remove transaction
document.addEventListener('click', (event) => {
  if(event.target.nodeName === 'I' && event.target.className === "ion-ios-close-outline"){
    transactionList.removeTransaction(event.target.closest('.item').getAttribute("data-transaction-id"));
    transactionList.calculate();
    UI.clear();
    UI.renderHTML();
    UI.updataHTML(transactionList.incomeSum,transactionList.expenseSum);
  }
})

console.log(transactionList);
console.log(n);