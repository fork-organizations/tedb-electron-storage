/**
 * Pluggable Storage Drivers
 * You can create plugins for TeDB to provide different mediums of storage. Below you'll find methods that TeDB will
 * expect in your plugin. Storage plugins implement a simple key-value store.
 */
export interface IStorageDriver {
    /**
     * Get item by key
     * @param key
     */
    getItem(key: string): Promise<any>;
    /**
     * Insert or Modify key-value pair
     * @param key
     * @param value
     */
    setItem(key: string, value: any): Promise<any>;
    /**
     * Remove item by key
     * @param key
     */
    removeItem(key: string): Promise<null>;
    /**
     * Store the index into its own file
     * @param key - the path to the element in the object
     * @param index - the JSON index
     */
    storeIndex(key: string, index: string): Promise<any>;
    /**
     * Retrieve the JSON from the file to be loaded into the datastore indices
     * @param key - the path to the element in the object
     */
    fetchIndex(key: string): Promise<any[]>;
    /**
     * Remove the saved JSON of a specific Index
     * @param key
     */
    removeIndex(key: string): Promise<null>;
    /**
     * Iterate every key-value pair,
     * IterationCallback should return truthy to break iteration(resulting in promise resolution)
     * IterationCallback should throw exceptions if error occurs, this will be caught by the promise and propagate up
     * the promise chain and handled accordingly.
     *
     * @param iteratorCallback - Function to iterate key values pairs, return truthy to break iteration
     */
    iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number) => any): Promise<any>;
    /**
     * Retrieve all keys - _ids of all documents for this
     */
    keys(): Promise<string[]>;
    /**
     * Sends back an object depending on if the file exists or not
     * -> USED IN THE SANITIZE METHOD
     * _ this helps with removing items from the index if their persistence is not found
     * or if they are not found in general.
     * @param {string} key
     * @param index
     * @param {string} fieldName
     * @returns {Promise<any>} should return an object like this
     *  {
     *      key: string;
     *      doesExist: boolean;
     *      index: IIndex;
     *      fieldName: string;
     *  }
     */
    exists(key: string, index: any, fieldName: string): Promise<any>;
    /**
     * Clear the entire datastore
     */
    clear(): Promise<null>;
}
