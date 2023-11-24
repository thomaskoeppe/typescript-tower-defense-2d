export interface ITextParser {
    parseText: (message: string, ...args: { [key: string]: any }[]) => string
}

export default class Parser {
     /**
      * Parses a string with variables in it, replacing them with the values provided.
      * 
      * @param message The string to parse.
      * @param vars The variables to replace.
      * 
      * @example
      * ```ts
      * const message = "Hello, %name%! You are %age% years old.";
      * const vars = {
      *    name: "John Doe",
      *   age: 42
      * };
      * 
      * const parsedMessage = Parser.parseText(message, vars);
      * 
      * console.log(parsedMessage);
      * 
      * // Hello, John Doe! You are 42 years old.
      * ```
      * 
      * @returns The parsed string.
      */
    public static parseText(message: string, vars: { [key: string]: any }): string {
        return message.replace(/%\w+%/g, function(all) {
            return vars[all.replace(/%/g, "")].toString() || "N/A";
        });
    }
}