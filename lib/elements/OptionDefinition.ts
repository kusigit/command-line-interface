export interface OptionDefinition {
  name: string;
  type: 'boolean' | 'number' | 'string' | 'object';
  description?: string;
  alias?: string;
  multiple?: boolean;
  defaultOption?: boolean;
  defaultValue?: any;
  parameterName?: string;
  isRequired?: boolean;
  validate?: (value: any) => void;
}
