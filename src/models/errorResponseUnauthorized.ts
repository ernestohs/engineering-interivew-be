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
import { Field } from './field';


export interface ErrorResponseUnauthorized { 
    /**
     * System Error Codes are very broad: each one can occur in one of many hundreds of locations in the system. 
     */
    code: number;
    /**
     * Gets additional key-value pairs describing error details.
     */
    data?: Array<Field> | null;
    /**
     * Operation over client was successful.
     */
    success: boolean;
    /**
     * Human-readable description of the status message.
     */
    message: string;
    /**
     * Information identifying when a certain event occurred, usually giving date and time of day, sometimes accurate to a small fraction of a second.
     */
    timestamp: string;
}

