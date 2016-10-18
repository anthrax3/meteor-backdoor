describe('xolvio/backdoor', function () {
  it('executes the passed code on the server', function (done) {
    const myFunction = function (globalToCheck) {
      return !!global[globalToCheck];
    };

    Meteor.call('xolvio/backdoor', myFunction.toString(), ['process'], function (error, result) {
      expect(error).toBeUndefined();
      expect(result).toEqual({
        value: true
      });
      done();
    });
  });

  it('returns the error when one happens', function (done) {
    const myFunction = function () {
      throw new Error('fire');
    };

    Meteor.call('xolvio/backdoor', myFunction.toString(), ['isServer'], function (error, result) {
      expect(error).toBeUndefined();
      expect(result).toEqual({
        error: jasmine.objectContaining({
          message: 'Error: fire'
        })
      });
      done();
    });
  });

  it('handles errors with no stack', function (done) {
    const myFunction = function () {
      const error = new Error('fire');
      delete error.stack;
      throw error;
    };

    Meteor.call('xolvio/backdoor', myFunction.toString(), ['isServer'], function (error, result) {
      expect(error).toBeUndefined();
      expect(result).toEqual({
        error: jasmine.objectContaining({
          message: 'Error: fire'
        })
      });
      done();
    });
  });

  it('require works', function (done) {
    const myFunction = function () {
      require('meteor/meteor');
    };

    Meteor.call('xolvio/backdoor', myFunction.toString(), function (error) {
      expect(error).toBeUndefined();
      done();
    });
  });
});
