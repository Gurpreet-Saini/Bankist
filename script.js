'use strict';


// Data
const account1 = {
  owner: "Gurpreet Saini",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Mohit Gupta",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2017-11-30T14:15:33.035Z",
    "2018-11-03T09:48:16.867Z",
    "2018-12-15T06:04:23.907Z",
    "2020-01-25T23:48:46.235Z",
    "2020-02-15T08:33:06.386Z",
    "2021-04-01T21:43:26.374Z",
    "2021-06-27T01:49:59.371Z",
    "2022-01-20T10:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2018-04-01T13:15:33.035Z",
    "2019-07-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2020-02-25T14:18:46.235Z",
    "2020-03-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2021-07-25T18:49:59.371Z",
    "2021-08-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

////Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const login=document.querySelector('.login');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const displayDate=document.querySelector('movements__date');

const calcDaysPassed = (date1,date2) =>
  Math.round(Math.abs(date2-date1)/(1000*60*60*24 ));
/// function  to create dates   
const fromatMovementsDate= function(date, locale ){ 
  
   const dayPassed=calcDaysPassed(new Date() , date);
  

  if(dayPassed===0) return 'Today';
  if(dayPassed===1) return 'Yesterday';
  if(dayPassed<=7)  return `${dayPassed} days ago`;


  // const day= `${date.getDate()}`.padStart(2,0);
  // const month=`${date.getMonth()+1}`.padStart(2,0);
  // const year= date.getFullYear();
  // return `${day}/${month}/${year}`;
  
     return new Intl.DateTimeFormat(locale).format(date);//Internationalization API.
 
}

const formatCur = function (value , locale , currency){
    return new Intl.NumberFormat(locale, {
    style:'currency',
    currency:currency,
  }).format(value);// formating the values
}

const displayMovements = function(acc, ){

  containerMovements.innerHTML= '';
    
   const movs = acc.movements;
   

  movs.forEach(function(mov , i){
     const type= mov>0?'deposit':'withdrawal';
     
    const date= new Date(acc.movementsDates[i]);
   const displayDate= fromatMovementsDate(date,acc.locale);

  const formattedMov = formatCur(mov ,acc.locale , acc.currency);

     const html= `
     <div class="movements__row">
     <div class="movements__type movements__type--${type}">${i+1} ${type} </div>
     <div class="movements__date" >${displayDate}</div>
     <div class="movements__value">${formattedMov}</div>
   </div>
     `;

     containerMovements.insertAdjacentHTML('afterbegin', html);// can't use beforeend order will be inverted.
     
  });

};


const createUsername = function(acc){
    acc.forEach(function(acc){
         acc.username=acc.owner
        .toLowerCase()
        .split(' ')
        .map( name => name[0])//.map(function(name){ return name[0]})
        .join('');
    });
};
createUsername(accounts);

const calcDisplaySummary= function(acc){
 
    const sumIn= acc.movements
    .filter(mov=> mov>0)
    .reduce((acc,mov)=> acc+mov,0);
    labelSumIn.textContent=formatCur(sumIn ,acc.locale , acc.currency);
   
    
      const sumOut= acc.movements
      .filter(mov=> mov<0)
      .reduce((acc,mov)=> acc+mov,0);
      labelSumOut.textContent=formatCur(sumOut ,acc.locale , acc.currency);
    
      const interest= acc.movements.filter(mov=> mov>0)
      .map(deposit => deposit*acc.interestRate/100)
      .filter( ( int , i , arr)=>{
        return int>=1;  // filter the intrest value which is less than 1
      } )
      .reduce( (acc, int )=> acc+int,0);
      labelSumInterest.textContent=formatCur(interest,acc.locale , acc.currency);
};



const calcDisplayBalance= function(acc){
  acc.balance = acc.movements.reduce((acc ,mov )=>acc+mov, 0 );


  labelBalance.textContent= formatCur(acc.balance ,acc.locale , acc.currency);

};

const updateUI= function(acc){
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
}
//logouttimer
 const startLogOutTimer= function(){
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer); //clear the timer
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };
  let time=120;

  tick();  
  const timer= setInterval(tick,1000);
   
  return timer;
    
 };


//     <EventHandler>    ///
let currentAccount, timer;
btnLogin.addEventListener('click', function(e){
    e.preventDefault();

    currentAccount=accounts.find(
      acc=> acc.username ===inputLoginUsername.value // Checking user identity and matching
    );

    // console.log(currentAccount);
if(currentAccount?.pin=== +inputLoginPin.value){ //+ here used to convert to number 
   // display ui  and message
    labelWelcome.textContent=`Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity=100;

  // login.style.display="none";
//     const now = new Date();
//     const day= `${now.getDate()}`.padStart(2,0);
//     const month= `${now.getMonth()+1}`.padStart(2,0);
//     const  year= now.getFullYear();
//     const hours= `${now.getHours()}`.padStart(2,0);
//     const min=`${now.getMinutes()}`.padStart(2,0);
// labelDate.innerHTML = `${day}/${month}/${year}, ${hours}:${min}`;
// console.log(labelDate);
const now = new Date();
const options= {
  hour: 'numeric',
  minute:'numeric',
  day:'numeric',
  month:'long',
  year:'numeric',
  weekday:'long',
};

labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale,options).format(now);

    // clear input fields
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();

   //start logouttimer
   if(timer) clearInterval(timer);

   timer=startLogOutTimer();
   //update ui
   updateUI(currentAccount);
  
    

} else{
  alert(` Invalid username and password`);
}
  
});

//   <-----Transfering money------->

btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = +(inputTransferAmount.value);
    const receiverAcc= accounts.find(
      acc=>acc.username === inputTransferTo.value
    );
    inputTransferAmount.value=inputTransferTo.value="";

       if(amount >0 &&
          receiverAcc&&
          currentAccount.balance>= amount &&
          receiverAcc?.username!== currentAccount.username
        ) {
          currentAccount.movements.push(-amount);
          receiverAcc.movements.push(amount);
          // add transfer date
          currentAccount.movementsDates.push(new Date().toISOString()); //return a string in date format
          receiverAcc.movementsDates.push(new Date().toISOString());

          //update UI
          updateUI(currentAccount);
          clearInterval(timer);
          timer= startLogOutTimer();
        }else{
          alert(`Check your entered values`);
        }
     
} );

//  <----------- getting Loan-------------->

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount=+(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some( mov => mov >= amount*0.1) ){
    setTimeout(function ()  {  //add movement
    currentAccount.movements.push(Math.round(amount));
    //loan date 
    currentAccount.movementsDates.push(new Date().toISOString());
    
    //update ui
    updateUI(currentAccount);
  }, 2000 );

  clearInterval(timer);
  timer=startLogOutTimer();

  }else {
    alert(`Loan not Approved for this amount`);
  }
    inputLoanAmount.value='';
});


//<----------close account-------------->
btnClose.addEventListener('click', function(e){
    e.preventDefault();
 
    if(
      inputCloseUsername.value===currentAccount.username && 
    +inputClosePin.value===currentAccount.pin  ){
        const index= accounts.findIndex( 
          acc=> acc.username === currentAccount.username
           );
           
           //delete account
           accounts.splice(index,1);
           // hide ui
           containerApp.style.opacity=0;

           inputClosePin.value=inputCloseUsername.value='';
           
          
          //   window.location.reload();
           return (labelWelcome.innerHTML='Log in to get started');


           
        }else {
          alert(` invalid details`);
        }
} );

 
