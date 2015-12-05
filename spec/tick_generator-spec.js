//spec file for tick_generator module.  This tests the various functions in the tick_generator and makes sure that the results are sane.

describe("Fast Backtest", function(){
  beforeEach(function(){
    this.addMatchers({
      toBeGreaterThanZero: function(){
        return (this.actual > 0);
      }
    });
  });

  var util = require('../tick_generator/helpers/util');

  it("calls the fastSend() function", function(){
    spyOn(util, "fastSend");
    console.log(util.fastBacktest("EURUSD", 1399092584.5, 25));
    expect(util.fastSend).toHaveBeenCalled();
  });
});