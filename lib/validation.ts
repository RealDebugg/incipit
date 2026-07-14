import { NextResponse } from 'next/server';

type ValidationRule = {
    field: string;
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
};

type ValidationSchema = ValidationRule[];

export function validateInput(
    data: any,
    schema: ValidationSchema
): { valid: boolean; error?: NextResponse } {
    for (const rule of schema) {
        const value = data[rule.field];

        // Check if required field is missing
        if (rule.required && (value === undefined || value === null)) {
            return {
                valid: false,
                error: NextResponse.json(
                    { error: `${rule.field} is required` },
                    { status: 400 }
                ),
            };
        }

        // Skip validation if field is not required and not provided
        if (!rule.required && (value === undefined || value === null)) {
            continue;
        }

        // Type validation
        if (typeof value !== rule.type) {
            return {
                valid: false,
                error: NextResponse.json(
                    { error: `${rule.field} must be a ${rule.type}` },
                    { status: 400 }
                ),
            };
        }

        // String-specific validations
        if (rule.type === 'string') {
            const trimmedValue = value.trim();

            if (!rule.allowEmpty && trimmedValue.length === 0) {
                return {
                    valid: false,
                    error: NextResponse.json(
                        { error: `${rule.field} cannot be empty` },
                        { status: 400 }
                    ),
                };
            }

            if (rule.minLength !== undefined && trimmedValue.length < rule.minLength) {
                return {
                    valid: false,
                    error: NextResponse.json(
                        { error: `${rule.field} must be at least ${rule.minLength} characters` },
                        { status: 400 }
                    ),
                };
            }

            if (rule.maxLength !== undefined && trimmedValue.length > rule.maxLength) {
                return {
                    valid: false,
                    error: NextResponse.json(
                        { error: `${rule.field} must be at most ${rule.maxLength} characters` },
                        { status: 400 }
                    ),
                };
            }
        }
    }

    return { valid: true };
}
