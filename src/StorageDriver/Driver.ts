import { IStorageDriverExtended, Iexist, Isanitize } from '../types';
import { SetItem, GetItem, Clear, FetchIndex, Iterate, Keys, RemoveIndex, RemoveItem, StoreIndex, Exists, CollectionSanitize } from './index';
import { existsSync, mkdirSync } from 'graceful-fs';
import { AppCustomDirectory, AppDirectory } from '../AppDirectory/index';
const path = require('path');

export class ElectronStorage implements IStorageDriverExtended {
    public allKeys: string[];
    public collectionPath: string;
    public version: string;
    public collection: string;
    public dbName: string;
    public appDirectory: AppDirectory;

    constructor(db: string, collection: string, dir: string | null) {
        this.dbName = db;
        this.collection = collection;

        if (dir !== null) {
            this.appDirectory =  new AppCustomDirectory(db, dir);
        } else {
            this.appDirectory = new AppDirectory(db);
        }

        // -------------------------------------------------------------------
        // This is a section that can be updated to change operation of the db
        // without affecting the operation of the db and the current file
        // current location of the readable items.
        // -------------------------------------------------------------------
        this.version = '`v0.0.1';
        if (!existsSync(this.appDirectory.userData())) {
            mkdirSync(this.appDirectory.userData());
        }
        this.collectionPath = path.join(this.appDirectory.userData(), 'db', this.collection);
        this.allKeys = [];
        if (!existsSync(`${path.join(this.appDirectory.userData(), 'db')}`)) {
            mkdirSync(`${path.join(this.appDirectory.userData(), 'db')}`);
        }
        if (!existsSync(this.collectionPath)) {
            mkdirSync(this.collectionPath);
        }

        // make sure that this version directory exists
        if (!existsSync(path.join(this.collectionPath, this.version))) {
            mkdirSync(path.join(this.collectionPath, this.version));
        }
        // make sure this versions states directory exists
        if (!existsSync(path.join(this.collectionPath, this.version, 'states'))) {
            mkdirSync(path.join(this.collectionPath, this.version, 'states'));
        }
        // -------------------------------------------------------------------
    }

    public setItem(key: string, value: any): Promise<any> {
        return SetItem(key, value, this);
    }

    public getItem(key: string): Promise<any> {
        return GetItem(key, this);
    }

    public removeItem(key: string): Promise<null> {
        return RemoveItem(key, this);
    }

    public storeIndex(key: string, index: string): Promise<null> {
        return StoreIndex(key, index, this);
    }

    public fetchIndex(key: string): Promise<any[]> {
        return FetchIndex(key, this);
    }

    public removeIndex(key: string): Promise<null> {
        return RemoveIndex(key, this);
    }

    public iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number) => any): Promise<any> {
        return Iterate(iteratorCallback, this);
    }

    public keys(): Promise<string[]> {
        return Keys(this);
    }

    public exists(obj: Isanitize, index: any, fieldName: string): Promise<Iexist> {
        return Exists(obj, index, fieldName, this);
    }

    public collectionSanitize(keys: string[]): Promise<null> {
        return CollectionSanitize(keys, this);
    }

    public clear(): Promise<null> {
        return Clear(this);
    }
}
