import {Injectable} from '@angular/core';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';

const DB_NAME = 'ionic-db-survey1.4';
const win: any = window;

@Injectable({
    providedIn: 'root'
})
export class SQLiteService {

    public dbLite: SQLite | any;

    constructor(
        private platform: Platform
    ) {
        console.log(this.platform);
        // if (this.platform.is('cordova')) {
        //     this.dbLite = new SQLite();
        //     console.log(this.dbLite);
        //     this.dbLite.openDatabase({
        //         name: DB_NAME,
        //         location: 'default' // the location field is required
        //     }).then(() => {
        //         this._Init();
        //     });
        // } else {
        //     console.warn('Storage: SQLite plugin not installed, ' +
        //         'falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
        //     this.dbLite = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
        //     this._Init();
        // }
        this.dbLite = win.openDatabase(DB_NAME, '1.4', 'database', 5 * 1024 * 1024);
        this._Init();
    }

    // Initialize the DB with our required tables
    _Init() {
        this.createUserTable();
        this.createQuestionTable();
        this.createSolutionTable();
        this.createHistoryTable();
    }

    insertMultiple(query, params: [][]) {
        return new Promise((resolve, reject) => {
            try {
                this.dbLite.transaction((tx: any) => {
                        const proms = [];
                        for (const param of params) {
                            proms.push(tx.executeSql(query, param));
                        }
                        return Promise.all(proms);
                    },
                    (err: any) => reject({err}));
            } catch (err) {
                reject({err});
            }
        });
    }

    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    query(query: string, params: any[] = []): Promise<{ tx?: any, res?: any, err?: any }> {
        return new Promise((resolve, reject) => {
            try {
                this.dbLite.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({tx, res}),
                            (tx: any, err: any) => reject({tx, err}));
                    },
                    (err: any) => reject({err}));
            } catch (err) {
                reject({err});
            }
        });
    }

    /**
     * Get all the value in the database identified by the given id.
     * @param {string} id the primary id
     * @param {string} table the table to be fetch
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    get(table: string, id?: string): Promise<any> {
        if (id === undefined) {
            return this.query('select * from ' + table, []).then(data => {
                if (data.res.rows.length > 0) {
                    return data.res.rows;
                }
            });
        }
        return this.query('select * from ' + table + ' where id = ? limit 1', [id]).then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0);
            }
        });
    }

    /**
     * insert the value in the database
     * @param {string} table the key
     * @param {[key:string] : any} keyUpdate The value updated
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    insert(table: string, keyUpdate: { [key: string]: any }): Promise<any> {
        let valueSet = '(';
        const valueUpdate = [];
        let valuePrefix = '(';

        for (const name in keyUpdate) {
            if (keyUpdate.hasOwnProperty(name)) {
                valueSet += name + ',';
                if (typeof keyUpdate[name] != 'string') {
                    valueUpdate.push(JSON.stringify(keyUpdate[name]));
                } else {
                    valueUpdate.push(keyUpdate[name]);
                }
                valuePrefix += '?,';
            }
        }
        if (valueUpdate.length === 0) {
            return Promise.reject('Value inserted was empty');
        }

        valueSet = valueSet.substr(0, valueSet.length - 1) + ')';
        valuePrefix = valuePrefix.substr(0, valuePrefix.length - 1) + ')';

        return this.query('insert into ' + table + ' ' + valueSet + ' values ' + valuePrefix + '', valueUpdate);
    }

    /**
     * update the value in the database
     * @param {string} table the table to be in-effective
     * @param {number} id the id of the value
     * @param {[key:string] : any} keyUpdate The value updated
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    update(table: string, keyUpdate: { [key: string]: any }, id: number) {
        let valueSet = '';
        const valueUpdate = [];

        for (const name in keyUpdate) {
            if (keyUpdate.hasOwnProperty(name)) {
                valueSet += name + '=?,';
                if (typeof keyUpdate[name] != 'string') {
                    valueUpdate.push(JSON.stringify(keyUpdate[name]));
                } else {
                    valueUpdate.push(keyUpdate[name]);
                }
            }
        }
        if (valueUpdate.length === 0) {
            return Promise.reject('Value inserted was empty');
        }

        valueSet = valueSet.substr(0, valueSet.length - 1) + '';

        valueUpdate.push(id);
        return this.query('update ' + table + ' set ' + valueSet + '  where id=?', valueUpdate);
    }

    /**
     * Remove the value in the database for the given key.
     * @param {string} id the primary id
     * @param {string} table the table
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    delete(table: string, id: string | number): Promise<any> {
        return this.query('delete from ' + table + ' where id = ?', [id]);
    }

    private createUserTable() {
        this.query('CREATE TABLE IF NOT EXISTS users (id INTEGER primary key, username VARCHAR(32), password VARCHAR(30))');
    }

    private createQuestionTable() {
        this.query('CREATE TABLE IF NOT EXISTS questions ' +
            '(id INTEGER primary key, question VARCHAR(190), correctSolution_id INTEGER, difficulty INTEGER)');
    }

    private createSolutionTable() {
        this.query('CREATE TABLE IF NOT EXISTS solutions (id INTEGER primary key, answer VARCHAR(190), question_id integer)');
    }

    private createHistoryTable() {
        this.query('CREATE TABLE IF NOT EXISTS histories (id INTEGER primary key, question_id INTEGER, solution_id INTEGER, answer_date varchar(190))');
    }
}
