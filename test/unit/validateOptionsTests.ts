import { assert } from 'assertthat';
import { CustomError } from 'defekt';
import { OptionDefinition } from '../../lib';
import { validateOptions } from 'lib/validateOptions';
import * as errors from '../../lib/errors';

suite('validateOptions', (): void => {
  suite('required', (): void => {
    test('throws an exception if a required option is undefined.', async (): Promise<void> => {
      const options = {
        option: undefined
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: true
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.throwing((ex): boolean =>
        ex.message === `Option 'option' is missing.` &&
        (ex as CustomError).code === errors.OptionMissing.code);
    });
  });

  suite('string', (): void => {
    test('accepts a valid string option.', async (): Promise<void> => {
      const options = {
        option: 'foo'
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string'
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });
  });

  suite('boolean', (): void => {
    test('accepts a valid boolean option.', async (): Promise<void> => {
      const options = {
        option: false
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'boolean'
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });
  });

  suite('number', (): void => {
    test('accepts a valid number option.', async (): Promise<void> => {
      const options = {
        option: 5
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'number'
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });

    test('accepts a missing, non-required number.', async (): Promise<void> => {
      const options = {
        option: undefined
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'number',
          isRequired: false
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });

    test('throws an exception if a number option is NaN.', async (): Promise<void> => {
      const options = {
        option: Number.NaN
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'number'
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.throwing((ex): boolean =>
        ex.message === `Option 'option' must be a number.` &&
        (ex as CustomError).code === errors.OptionInvalid.code);
    });
  });

  suite('validate', (): void => {
    test('throws an exception for required options if validate fails.', async (): Promise<void> => {
      const options = {
        option: 'foo'
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: true,
          validate (): void {
            throw new Error('Invalid value.');
          }
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.throwing((ex): boolean =>
        ex.message === `Invalid value.` &&
        (ex as CustomError).code === errors.OptionInvalid.code);
    });

    test('does not throw an exception for required options if validate succeeds.', async (): Promise<void> => {
      const options = {
        option: 'foo'
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: true,
          validate (): void {
            // Intentionally do nothing.
          }
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });

    test('throws an exception for optional options if validate fails.', async (): Promise<void> => {
      const options = {
        option: 'foo'
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: false,
          validate (): void {
            throw new Error('Invalid value.');
          }
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.throwing((ex): boolean =>
        ex.message === `Invalid value.` &&
        (ex as CustomError).code === errors.OptionInvalid.code);
    });

    test('does not throw an exception for optional options if the value is missing.', async (): Promise<void> => {
      const options = {};
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: false,
          validate (): void {
            throw new Error('Invalid value.');
          }
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });

    test('does not throw an exception for optional options if validate succeeds.', async (): Promise<void> => {
      const options = {
        option: 'foo'
      };
      const optionDefinitions: OptionDefinition[] = [
        {
          name: 'option',
          type: 'string',
          isRequired: false,
          validate (): void {
            // Intentionally do nothing.
          }
        }
      ];

      assert.that((): void => {
        validateOptions({ options, optionDefinitions });
      }).is.not.throwing();
    });
  });
});
