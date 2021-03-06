(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.capital = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * amortization table calculations
 * ===============================
 * calculates the monthly payment
 * calculates remaining loan balance
 * calculates sum of interest payments
 * calculates sum of principal payments
 * @param {number} amount
 * @param {number} rate
 * @param {number} totalTerm
 * @param {number} amortizeTerm
 * @returns {object}
 */
var amortizationCalc = function(amount, rate, totalTerm, amortizeTerm) {
  var periodInt,
      monthlyPayment,
      summedInterest = 0,
      summedPrincipal = 0,
      monthlyIntPaid,
      monthlyPrincPaid,
      summedAmortize = {};

  // Calculate monthly interest rate and monthly payment
  periodInt = (rate / 12) / 100;
  monthlyPayment = amount * (periodInt / (1 - Math.pow(1 + periodInt, -(totalTerm))));
  // If zero or NaN is returned (i.e. if the rate is 0) calculate the payment without interest
  monthlyPayment = monthlyPayment || amount / totalTerm;

  // Calculate the interest, principal, and remaining balance for each period
  var i = 0;
  while( i < amortizeTerm) {
    monthlyIntPaid = amount * periodInt;
    monthlyPrincPaid = monthlyPayment - monthlyIntPaid;
    summedInterest = summedInterest + monthlyIntPaid;
    summedPrincipal = summedPrincipal + monthlyPrincPaid;
    amount = amount - monthlyPrincPaid;
    i += 1;
  }

  summedAmortize.interest = summedInterest;
  summedAmortize.principal = summedPrincipal;
  summedAmortize.balance = amount;
  summedAmortize.payment = monthlyPayment;

  return summedAmortize;

};

/**
 * Throw an error if a string or number below 0 is passed
 * @param {object}
 * @returns {object}
 */
var errorCheck = function(opts) {
  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      if (typeof opts[key] === 'undefined' || isNaN(parseFloat(opts[key])) || opts[key] < 0) {
        throw new Error('Loan ' + key + ' must be a non-negative value.');
      }
    }
  }
};

/**
 * Round values to two decimal places
 * @param {object}
 * @returns {object}
 */
var roundNum = function(numObj) {
  var tmp = {};
  for (var property in numObj) {
    tmp[property] = numObj[property];
    tmp[property + 'Round'] = (Math.round(numObj[property] * 100) / 100).toFixed(2);
  }
  return tmp;
};

/**
 * Pass values and return output
 * @param {object} amount, rate, totalTerm, amortizeTerm
 * @example amortize({amount: 180000, rate: 4.25, totalTerm: 360, amortizeTerm: 60})
 * @returns {object}
 */
var amortize = function(opts) {
  errorCheck(opts);
  var amortized = amortizationCalc(opts.amount, opts.rate, opts.totalTerm, opts.amortizeTerm);
  return roundNum(amortized);
};

module.exports = amortize;
},{}],2:[function(require,module,exports){
"use strict";
var amortize = require('amortize'),
    enforcePositive = require('./utils/enforce/number/positive'),
    sumArray = require('./utils/sumArray');
function amortization(opts) {
  var $__1;
  var $__0 = opts,
      amount = $__0.amount,
      rate = $__0.rate,
      totalTerm = $__0.totalTerm,
      amortizeTerm = ($__1 = $__0.amortizeTerm) === void 0 ? true : $__1,
      result = {};
  enforcePositive(opts);
  if (!amount || !rate || !totalTerm || !amortizeTerm) {
    throw new Error('Amount, rate, totalTerm, and amortizeTerm are required and must be non-negative.');
  }
  result = amortize(opts);
  return result;
}
module.exports = amortization;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/amortization.js
},{"./utils/enforce/number/positive":9,"./utils/sumArray":11,"amortize":1}],3:[function(require,module,exports){
"use strict";
var enforcePositive = require('./utils/enforce/number/positive'),
    sumArray = require('./utils/sumArray');
function arrayCheck(val) {
  if (val.constructor === Array) {
    val = sumArray(val);
  }
  return val;
}
function cashFlow(opts) {
  var $__1;
  var $__0 = opts,
      income = $__0.income,
      expenses = ($__1 = $__0.expenses) === void 0 ? true : $__1,
      result = {};
  enforcePositive(opts);
  if (!income || !expenses) {
    throw new Error('Income and expenses are required and must be non-negative.');
  }
  result.income = arrayCheck(income);
  result.expenses = arrayCheck(expenses);
  result.cash = result.income - result.expenses;
  return result;
}
module.exports = cashFlow;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/cash-flow.js
},{"./utils/enforce/number/positive":9,"./utils/sumArray":11}],4:[function(require,module,exports){
"use strict";
var enforceNumber = require('./utils/enforce/number');
function compoundAnnualGrowthRate(opts) {
  var $__0 = opts,
      startValue = $__0.startValue,
      endValue = $__0.endValue,
      years = $__0.years,
      result = {};
  enforceNumber(opts);
  if (!startValue || !endValue || !years) {
    throw new Error('Start value, end value and years are required and must be numbers.');
  }
  result.raw = Math.pow(endValue / startValue, 1 / years) - 1;
  result.rounded = Math.round(result.raw * 1000) / 1000;
  result.percent = result.rounded * 100;
  return result;
}
module.exports = compoundAnnualGrowthRate;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/compound-annual-growth-rate.js
},{"./utils/enforce/number":8}],5:[function(require,module,exports){
"use strict";
module.exports = {
  'interest': require('./interest'),
  'cash-flow': require('./cash-flow'),
  'compound-annual-growth-rate': require('./compound-annual-growth-rate'),
  'inflation-adjusted-return': require('./inflation-adjusted-return'),
  'amortization': require('./amortization')
};

//# sourceURL=/Users/scotta/Projects/capitaljs/src/index.js
},{"./amortization":2,"./cash-flow":3,"./compound-annual-growth-rate":4,"./inflation-adjusted-return":6,"./interest":7}],6:[function(require,module,exports){
"use strict";
function inflationAdjustedReturn(opts) {
  var $__1;
  var $__0 = opts,
      investmentReturn = $__0.investmentReturn,
      inflationRate = ($__1 = $__0.inflationRate) === void 0 ? true : $__1,
      realReturn;
  if (!investmentReturn || !inflationRate) {
    throw new Error('Income and expenses are required and must be non-negative.');
  }
  realReturn = ((1 + investmentReturn) / (1 + inflationRate) - 1) * 100;
  realReturn = (Math.round(realReturn * 100) / 100);
  return realReturn;
}
module.exports = inflationAdjustedReturn;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/inflation-adjusted-return.js
},{}],7:[function(require,module,exports){
"use strict";
var enforcePositive = require('./utils/enforce/number/positive');
function interest(opts) {
  var $__1;
  var $__0 = opts,
      principal = $__0.principal,
      rate = $__0.rate,
      years = $__0.years,
      compounding = ($__1 = $__0.compounding) === void 0 ? true : $__1,
      result = {};
  delete opts.compounding;
  enforcePositive(opts);
  if (!principal || !rate || !years) {
    throw new Error('Principal, rate and years are required and must be non-negative.');
  }
  if (compounding) {
    result.interest = principal * Math.pow(Math.E, rate * years) - principal;
  } else {
    result.interest = principal * rate * years;
  }
  result.total = principal + result.interest;
  return result;
}
module.exports = interest;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/interest.js
},{"./utils/enforce/number/positive":9}],8:[function(require,module,exports){
"use strict";
function enforceNumber(opts) {
  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      if (typeof opts[key] === 'undefined' || isNaN(parseFloat(opts[key]))) {
        throw new Error(key + ' must be a number.');
      }
    }
  }
}
;
module.exports = enforceNumber;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/utils/enforce/number/index.js
},{}],9:[function(require,module,exports){
"use strict";
var processOpts = require('../../processOpts');
function check(key, val) {
  if (typeof val === 'undefined' || isNaN(parseFloat(val)) || val < 0) {
    throw new Error(key + ' must be a non-negative value.');
  }
}
function enforceNonNegativeNumber(opts) {
  processOpts(opts, check);
}
;
module.exports = enforceNonNegativeNumber;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/utils/enforce/number/positive.js
},{"../../processOpts":10}],10:[function(require,module,exports){
"use strict";
function processOpts(opts, cb) {
  if (opts === Object(opts) && Object.prototype.toString.call(opts) !== '[object Array]') {
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        cb(key, opts[key]);
      }
    }
  } else if (opts instanceof Array) {
    for (var i = 0; i < opts.length; i++) {
      cb('All params', opts[i]);
    }
  } else {
    cb('All params', opts);
  }
}
;
module.exports = processOpts;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/utils/processOpts.js
},{}],11:[function(require,module,exports){
"use strict";
function sumArray(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}
module.exports = sumArray;

//# sourceURL=/Users/scotta/Projects/capitaljs/src/utils/sumArray.js
},{}]},{},[5])(5)
});