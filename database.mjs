import { DatabaseError } from "./databaseError.mjs";
import { Parser } from "./parser.mjs";

export class Database {  
    constructor() {
        this.parser = new Parser();
        this.tables = {};
    };

    createTable(parsedStatement) {
        const tableName = parsedStatement[1];
        let columns = parsedStatement[2].split(', ');
        
        this.tables[tableName] = {
            columns: {},
            data: []
        }

        for(let column of columns) {
            let [key, value] = column.split(' ');
            this.tables[tableName].columns[key] = value;
        }
                
    };
    insert(parsedStatement) {
        const tableName = parsedStatement[1];
        let columns = parsedStatement[2].split(', ');
        let values = parsedStatement[3].split(', ');
        // Poderia aplicar o destructuring como feito no select;

        let row = {};
        
        for(let i = 0; i < columns.length; i++) {
            row[columns[i]] = values[i];
        }

        this.tables[tableName].data.push(row);

    };
    select(parsedStatement) {
        let [, columns, tableName, whereParsed] = parsedStatement;
        let rows = this.tables[tableName].data
        columns = columns.split(', ');

        if(whereParsed) {
            const[columnWhere, valueWhere] = whereParsed.split(' = ');
            rows = rows.filter(function(people) {
                return people[columnWhere] === valueWhere;
            });  
        }

        rows = rows.map(function(people) {
            let localRow = {};
            /* Alterativa do Branas ao invés do for
                columns.forEach((column) => {
                localRow[column] = people[column]
            })
            */
            for(let column of columns) {
                localRow[column] = people[column];
            }
            return localRow;
        });

        return rows; // Fazer um return rows e console.log na principal
    };
    delete(parsedStatement) {
        let [, tableName, whereParsed] = parsedStatement;
        let rows = this.tables[tableName].data;
        
        if(whereParsed) {
            const [columnWhere, valueWhere] = whereParsed.split(' = ');
    
            const indexDelete = rows.findIndex(function(people) {
                return people[columnWhere] === valueWhere;
            });            
            rows.splice(indexDelete, 1);
        } else {
            rows = [];
        }
        this.tables[tableName].data = rows;

        /* Alternativa do Branas
            if(whereClause) {
            let [columnWhere, valueWhere] = whereClause.split(' = ')
            this.tables[tableName].data = this.tables[tableName].data.filter((people) => {
                return people[columnWhere] !== valueWhere
            })
        } else {
            this.tables[tableName].data = []
        }
        */
    };
    execute(statement) {
        return new Promise((resolve, reject) => {
            let objectCriation = this.parser.parse(statement)
            setTimeout(() => {
                if(objectCriation) {
                  resolve(this[objectCriation.command](objectCriation.parsedStatement));

                }
                const message = `Syntax error: '${statement}'`;
                reject(new DatabaseError(statement, message));

            }, 1000);
        });
    };
};

