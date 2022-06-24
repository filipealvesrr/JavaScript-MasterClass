export class Parser {
    constructor() {
        this.commands = new Map([['createTable', /create table (\w+) \((.+)\)/], ['insert', /insert into (\w+) \((.+)\) values \((.+)\)/], ['select', /select (.+) from (\w+)(?: where (.+))?/], ['delete', /delete from (\w+)(?: where (.+))?/]]);
        // Poderia usar set para adicionar no Map
    }

    parse = function(statement) {
        for(let [command, regExp] of this.commands) {
            if(statement.match(regExp)){
                return {
                    command,
                    parsedStatement: statement.match(regExp)
                };
            }
        }
    };
};
