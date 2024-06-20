/**
 * Task Management API
 * API for managing tasks with different states
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * Field is a *generic* type that consists of two related data elements: A key, which is a constant that defines the data set (e.g., *color*, *price*), and a value, which is a variable that belongs to the set (e.g., *green*, *100*). 
 */
export interface Field { 
    /**
     * Field name.
     */
    key: string;
    /**
     * Field value.
     */
    value: string;
}

