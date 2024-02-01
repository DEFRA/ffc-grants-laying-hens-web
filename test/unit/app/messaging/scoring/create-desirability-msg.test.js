const { getUserAnswer }= require('./../../../../../app/messaging/scoring/create-desirability-msg');

describe('getUserAnswer', () => {
    it('should return an array of objects with keys and values if answers are provided', () => {
      const answers = { a: '1', b: '2', c: '3' };
      const userInput = ['1', '2'];
      const expected = [{ key: 'a', value: '1' }, { key: 'b', value: '2' }];
      expect(getUserAnswer(answers, userInput)).toEqual(expected);
    });
  
    it('should return an empty array if no answers are provided', () => {
      const userInput = ['1', '2'];
      expect(getUserAnswer(null, userInput)).toEqual({});
    });
  
    it('should return an empty array if the user input does not match any answers', () => {
      const answers = { a: '1', b: '2', c: '3' };
      const userInput = ['4', '5'];
      expect(getUserAnswer(answers, userInput)).toEqual([{ key: undefined, value: '4'}, { key: undefined, value: '5'}]);
    });
  });